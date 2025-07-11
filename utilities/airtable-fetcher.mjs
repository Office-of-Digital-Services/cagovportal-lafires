//@ts-check

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
    //trim all string fields
    Object.keys(record.fields).forEach(key => {
      if (typeof record.fields[key] === "string") {
        record.fields[key] = record.fields[key]
          .replace(/\u00A0/g, " ") // replace non-breaking spaces with regular spaces
          .trim();
      }
    });

    for (const key in record.fields) {
      if (!record.fields[key]?.toString().length) {
        delete record.fields[key];
      }
    }

    // convert any fields that are arrays of length 1 to just the first item
    Object.keys(record.fields).forEach(key => {
      if (
        Array.isArray(record.fields[key]) &&
        record.fields[key].length === 1
      ) {
        record.fields[key] = record.fields[key][0];
      }
    });

    // sort fields alphabetically
    record.fields = sortFieldsRecursively(record.fields);
  });

  // Function to sort fields in an object recursively
  /**
   * @param {{ [x: string]: any; }} obj
   */
  function sortFieldsRecursively(obj) {
    const sortedKeys = Object.keys(obj).sort();
    const sortedObj = {};

    sortedKeys.forEach(
      key =>
        (sortedObj[key] =
          typeof obj[key] === "object" && !Array.isArray(obj[key])
            ? sortFieldsRecursively(obj[key])
            : obj[key])
    );

    return sortedObj;
  }

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
