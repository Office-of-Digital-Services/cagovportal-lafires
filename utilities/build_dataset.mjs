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

  /**
   *
   * @param {string} key
   * @param {string} en
   */
  const updateTranslation = (key, en) => {
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

  alldata.forEach(audience => {
    updateTranslation(
      `sf_audience_type_${audience.fields["Audience ID"]}_label`,
      audience.fields["Audience"]
    );

    audience.children_service_types.forEach(service_type => {
      updateTranslation(
        `sf_service_type_${service_type.fields["Service Type ID"]}_label`,
        service_type.fields["Service type"]
      );

      service_type.children_categories.forEach(category => {
        const category_fields = category.fields;
        const category_id = category_fields["Category ID"];

        updateTranslation(
          `sf_cat_${category_id}_label`,
          category_fields.Category
        );
        updateTranslation(
          `sf_cat_${category_id}_description`,
          category_fields["Category description"]
        );

        category.children_services.forEach(
          (
            /** @type {{ fields: { ID: string; Service_name: string; Description: string; Entity: string; }; }} */ service
          ) => {
            const service_fields = service.fields;
            const service_id = service_fields.ID;

            updateTranslation(
              `sf_${service_id}_service_name`,
              service_fields.Service_name
            );
            updateTranslation(
              `sf_${service_id}_description`,
              service_fields.Description
            );
            updateTranslation(`sf_${service_id}_entity`, service_fields.Entity);
          }
        );
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
