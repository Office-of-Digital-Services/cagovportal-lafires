//@ts-check
// airtable-fetcher.js
// ———————————————————————————————————————————————
// Re-usable module for pulling multiple Airtable views.
// Usage:
//   import { fetchAndSaveAll } from "./airtable-fetcher.js";
//   /** @type {FetchJob[]} */
//   const jobs = [
//     { apiPath: "appId/tblFoo?view=viw123", outputPath: "./data/foo.json" },
//     { apiPath: "appId/tblBar?view=viw456", outputPath: "./data/bar.json" },
//   ];
//   await fetchAndSaveAll(jobs);
// ———————————————————————————————————————————————

// API Documentation: https://airtable.com/developers/web/api/list-records

import fs from "node:fs/promises";
import path from "node:path";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.AIRTABLE_API_KEY;
if (!API_KEY) {
  throw new Error(
    `❌ ERROR: Missing API Key.
    Retrieve key from https://airtable.com/create/tokens.
    Ensure you have .env in root with format...
    AIRTABLE_API_KEY="your_key"`
  );
}

const BASE_URL = "https://api.airtable.com/v0";

/**
 * @typedef {object} FetchJob
 * @property {string} apiPath    Path suffix for Airtable API (e.g. "appId/tblId?view=viwXYZ")
 * @property {string} outputPath Local file path where the JSON will be written
 */

/**
 * @typedef {Record<string, any>} AirtableFields
 */

/**
 * @typedef {object} AirtableRecord
 * @property {string} id
 * @property {string} createdTime
 * @property {AirtableFields} fields
 */

/**
 * Deep‐sorts an object’s keys (non‐array) and returns a fresh clone.
 * @param {{ [key: string]: any }} obj
 * @returns {{ [key: string]: any }}
 */
function sortFieldsRecursively(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      const val = obj[key];
      acc[key] =
        val && typeof val === "object" && !Array.isArray(val)
          ? sortFieldsRecursively(val)
          : val;
      return acc;
    }, /** @type {{ [key:string]: any }} */ ({}));
}

/**
 * Applies `sortFieldsRecursively` to every object in the array.
 * @param {Array<AirtableFields>} arr
 * @returns {Array<AirtableFields>}
 */
function sortFieldsInObjects(arr) {
  return arr.map(sortFieldsRecursively);
}

/**
 * Fetches one Airtable “view”, cleans up blank fields, sorts keys, and returns the array of field-objects.
 * @param {string} apiPath API path after the base URL, e.g. "appId/tblId?view=viwXYZ"
 * @returns {Promise<Array<AirtableFields>>}
 */
async function fetchAirtableRecords(apiPath) {
  const url = `${BASE_URL}/${apiPath}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(
        `Unauthorized (401) fetching ${apiPath}. Check AIRTABLE_API_KEY & permissions.`
      );
    }
    throw new Error(
      `HTTP ${res.status} fetching ${apiPath}: ${res.statusText}`
    );
  }

  const body = /** @type {{ records?: AirtableRecord[] }} */ (await res.json());
  const records = (body.records || []).map(r => ({
    _: {
      id: r.id,
      createdTime: r.createdTime
    },
    ...r.fields
  }));

  if (records.length === 0) {
    console.warn(`⚠️ No records found for ${apiPath}`);
  }

  const cleaned = sortFieldsInObjects(records).map(rec => {
    Object.entries(rec).forEach(([k, v]) => {
      if (
        v
          ?.toString()
          .replace(/\u00A0/g, " ")
          .trim().length === 0
      ) {
        delete rec[k];
      }
    });
    return rec;
  });

  return cleaned;
}

/**
 * Writes the given data array to a JSON file, creating directories as needed.
 * @param {Array<AirtableFields>} data
 * @param {string} filePath
 * @returns {Promise<void>}
 */
async function saveDataToFile(data, filePath) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✅ Wrote ${data.length} records to ${filePath}`);
}

/**
 * Fetches & writes multiple Airtable views in parallel.
 * @param {FetchJob[]} jobs
 * @returns {Promise<void>}
 */
export async function fetchAndSaveAll(jobs) {
  console.time("⏳ Airtable total");
  await Promise.all(
    jobs.map(async ({ apiPath, outputPath }) => {
      const label = path.basename(outputPath);
      try {
        console.time(`⏳ ${label}`);
        const data = await fetchAirtableRecords(apiPath);
        await saveDataToFile(data, outputPath);
        console.timeEnd(`⏳ ${label}`);
      } catch (err) {
        console.error(`❌ Error on ${label}:`, err.message);
      }
    })
  );
  console.timeEnd("⏳ Airtable total");
}
