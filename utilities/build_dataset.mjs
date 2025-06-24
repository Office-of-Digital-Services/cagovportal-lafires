//@ts-check
// scripts/run-fetch.js
import { fetchAll } from "./airtable-fetcher.mjs";
import path from "node:path";
import fs from "node:fs";

const service_finder_base = "app6t1QEuuPs8NUhg/";
const service_finder_data_path = "./src/_data/service_finder_data.json";
const service_finder_translations_path =
  "./src/_data/i18n/i18n-service-finder-dynamic.json";

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

  writeTranslations(all_audience);
})();

function writeTranslations(alldata) {
  const translations = JSON.parse(
    fs.readFileSync(service_finder_translations_path, "utf8")
  );

  const freshTranslations = {};

  let updatedCount = 0;
  alldata.forEach(audience => {
    audience.children_service_types.forEach(service_type => {
      service_type.children_categories.forEach(category => {
        category.children_services.forEach(service => {
          /**
           *
           * @param {string} ID
           * @param {string} en
           * @param {string} postfix
           */
          const updateValue = (ID, en, postfix) => {
            const key = `sf_${ID}_${[postfix]}`;

            const blank = {
              status: "english_only",
              en
            };

            const value = translations[key];

            if (value?.en != blank.en) {
              freshTranslations[key] = blank;
              updatedCount++;
            } else {
              freshTranslations[key] = value;
            }
          };

          updateValue(service.fields.ID, service.fields.Service_name, "name");

          updateValue(
            service.fields.ID,
            service.fields.Description,
            "description"
          );

          updateValue(service.fields.ID, service.fields.Entity, "entity");
        });
      });
    });
  });

  if (updatedCount) {
    // Sort all the keys in the translations object
    const sortedTranslations = Object.keys(freshTranslations)
      .sort()
      .reduce((obj, key) => {
        obj[key] = freshTranslations[key];
        return obj;
      }, {});

    // Write the updated translations back to the file
    fs.writeFileSync(
      service_finder_translations_path,
      JSON.stringify(sortedTranslations, null, 2)
    );
    console.log(
      `✅ Wrote ${updatedCount} service finder translations to ${service_finder_translations_path}`
    );
  }
}
