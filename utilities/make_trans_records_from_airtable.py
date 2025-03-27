#! /usr/bin/env python3

import json

with open('src/_data/airTable.json', 'r') as f:
    data = json.load(f)

for item in data:
    if item['ID'] >= 40:
        id = item['ID']
        service_name = item['Service_name']
        description = item['Description']
        entity = item['Entity']
        print(f"""
  sf_{id}_service_name: {{
    src_file: "src/_data/airTable.json",
    en: {json.dumps(service_name)},
    es: "",
    fr: "",
    tl: "",
    ko: "",
    vi: "",
    "zh-hans": "",
    "zh-hant": "",
    hy: ""
  }},
  sf_{id}_entity: {{
    src_file: "src/_data/airTable.json",
    en: {json.dumps(entity)},
    es: "",
    fr: "",
    tl: "",
    ko: "",
    vi: "",
    "zh-hans": "",
    "zh-hant": "",
    hy: ""
  }},
  sf_{id}_description: {{
    src_file: "src/_data/airTable.json",
    en: {json.dumps(description)},
    es: "",
    fr: "",
    tl: "",
    ko: "",
    vi: "",
    "zh-hans": "",
    "zh-hant": "",
    hy: ""
  }},""")
