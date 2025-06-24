//@ts-check
// scripts/run-fetch.js
import { fetchAndSaveAll } from "./airtable-fetcher.mjs";

const service_finder_base = "app6t1QEuuPs8NUhg/";
const service_finder_data_path = "./src/_data/lafires/service_finder/";

const JOBS = [
  {
    outputPath: `${service_finder_data_path}services.json`,
    apiPath: `${service_finder_base}tblMX0nRW5yTbr5Y6?view=viwInn4NqAYYmXTox`
  },
  {
    outputPath: `${service_finder_data_path}audience.json`,
    apiPath: `${service_finder_base}tbl1VARn9h0uJPcd7`
  },
  {
    outputPath: `${service_finder_data_path}service_types.json`,
    apiPath: `${service_finder_base}tblxCF14lRjLz7BJO`
  },
  {
    outputPath: `${service_finder_data_path}categories.json`,
    apiPath: `${service_finder_base}tbl0GyxvoQWTpSE3R`
  }
];

(async () => {
  await fetchAndSaveAll(JOBS);
})();
