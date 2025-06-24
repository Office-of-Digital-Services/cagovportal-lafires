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
 * @property {string} label    name of the job, used for logging
 */

/**
 * @typedef {Record<string, any>} AirtableFields
 */

/**
 * @typedef {object} AirtableRecord
 * @property {string} id
 * @property {string} createdTime
 * @property {AirtableRecord[]} [children]
 * @property {AirtableFields} fields
 */

/**
 * Fetches one Airtable “view”, cleans up blank fields, sorts keys, and returns the array of field-objects.
 * @param {string} apiPath API path after the base URL, e.g. "appId/tblId?view=viwXYZ"
 * @returns {Promise<Array<AirtableRecord>>}
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

  const body = /** @type {{ records: AirtableRecord[] }} */ (await res.json())
    .records;

  // Remove empty columns from sorted object
  body.forEach(record => {
    Object.keys(record.fields).forEach(key => {
      if (
        record.fields[key]
          ?.toString()
          .replace(/\u00A0/g, " ")
          .trim().length === 0
      ) {
        delete record.fields[key];
      }
    });
  });

  return body;
}

/**
 * Fetches multiple Airtable views in parallel and returns their data.
 * @param {FetchJob[]} jobs
 */
export async function fetchAll(jobs) {
  console.time("⏳ Airtable total");
  const results = await Promise.all(
    jobs.map(async ({ apiPath, label }) => {
      try {
        console.time(`⏳ ${label}`);
        const data = await fetchAirtableRecords(apiPath);
        console.timeEnd(`⏳ ${label}`);
        return data;
      } catch (err) {
        console.error(`❌ Error on ${label}:`, err.message);
        return [];
      }
    })
  );
  console.timeEnd("⏳ Airtable total");
  return results;
}
