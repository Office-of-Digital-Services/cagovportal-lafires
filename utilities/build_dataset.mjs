import fs from "node:fs";
import path from "node:path";
import fetch from "node-fetch";
import dotenv from "dotenv";

// ✅ Load environment variables from .env file
dotenv.config();

// 🔹 SETUP CONFIGURATION - Customize these values as needed
const API_URL =
  "https://api.airtable.com/v0/app6t1QEuuPs8NUhg/tblMX0nRW5yTbr5Y6?view=viwInn4NqAYYmXTox"; // Airtable API URL with the correct table/view
const API_KEY = process.env.AIRTABLE_API_KEY; // 🔹 Ensure .env has AIRTABLE_API_KEY=
const OUTPUT_JSON_PATH = path.resolve(process.cwd(), "src/_data/airTable.json"); // Output JSON file

// ✅ Check if API key exists
if (!API_KEY) {
  console.error(
    "❌ ERROR: Missing API Key. Ensure you have an .env file with AIRTABLE_API_KEY=your_key"
  );
  process.exit(1);
}

// ✅ Function to fetch data from Airtable
const fetchAirtableData = async () => {
  try {
    console.log("🔹 Fetching Airtable data...");

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status} - ${response.statusText}`
      );
    }

    const responseJson = await response.json();

    if (!responseJson.records || responseJson.records.length === 0) {
      console.warn("⚠️ WARNING: No records found in Airtable.");
      return [];
    }

    // ✅ Extract fields from each record
    const records = responseJson.records.map(record => record.fields);

    console.log(`✅ Successfully retrieved ${records.length} records.`);

    return records;
  } catch (error) {
    console.error("❌ ERROR Fetching Airtable Data:", error);
    return [];
  }
};

// ✅ Function to save data to a JSON file
const saveDataToFile = (data, filePath) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Data saved to ${filePath}`);
  } catch (error) {
    console.error(`❌ ERROR Writing to File ${filePath}:`, error);
  }
};

// ✅ Main function
const run = async () => {
  console.time("⏳ Airtable Fetch Time");

  const data = await fetchAirtableData();
  saveDataToFile(data, OUTPUT_JSON_PATH);

  console.timeEnd("⏳ Airtable Fetch Time");
};

// 🔥 Execute script
run();
