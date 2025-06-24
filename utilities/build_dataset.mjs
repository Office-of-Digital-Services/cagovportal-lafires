//@ts-check
// scripts/run-fetch.js
import { fetchAll } from "./airtable-fetcher.mjs";
import path from "node:path";
import fs from "node:fs";

const service_finder_base = "app6t1QEuuPs8NUhg/";
const service_finder_data_path = "./src/_data/service_finder_data.json";

/** @type {import("./airtable-fetcher.mjs").FetchJob[]} */
const JOBS = [
  {
    label: `services`,
    apiPath: `${service_finder_base}tblMX0nRW5yTbr5Y6?view=viwInn4NqAYYmXTox`
  },
  {
    label: `audience`,
    apiPath: `${service_finder_base}tbl1VARn9h0uJPcd7`
  },
  {
    label: `service_types`,
    apiPath: `${service_finder_base}tblxCF14lRjLz7BJO`
  },
  {
    label: `categories`,
    apiPath: `${service_finder_base}tbl0GyxvoQWTpSE3R`
  }
];

(async () => {
  /**
   *
   * @param {import("./airtable-fetcher.mjs").AirtableRecord[]} childrows
   * @param {import("./airtable-fetcher.mjs").AirtableRecord[]} parentrows
   * @param {string} parentField
   * @param {string} childrenColumnName
   */
  const fillChildren = (
    childrows,
    parentrows,
    parentField,
    childrenColumnName = "children"
  ) => {
    childrows.forEach(row => {
      const myparentid = row.fields[parentField];

      const parent = parentrows.find(p => p.id === myparentid);
      if (!parent)
        throw new Error(`Parent not found for ${row.id} in ${parentField}`);
      parent[childrenColumnName] = parent[childrenColumnName] || [];
      parent[childrenColumnName].push(row);
    });
  };

  const alldata = await fetchAll(JOBS);

  // get the 4 objects from alldata by array index 0-3
  const [all_services, all_audience, all_service_types, all_categories] =
    alldata;

  fillChildren(
    all_services,
    all_categories,
    "Category Linked",
    "children_services"
  );
  fillChildren(
    all_categories,
    all_service_types,
    "Service type",
    "children_categories"
  );
  fillChildren(
    all_service_types,
    all_audience,
    "Audience",
    "children_service_types"
  );

  fs.mkdirSync(path.dirname(service_finder_data_path), { recursive: true });
  fs.writeFileSync(
    service_finder_data_path,
    JSON.stringify(all_audience, null, 2)
  );

  console.log(`✅ Wrote service finder data to ${service_finder_data_path}`);
})();
