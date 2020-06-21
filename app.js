const fs = require("fs");
let data = fs.readFileSync("input.csv", "utf8");
let [headers, ...rest] = data.split("\n");
let template = {};
headers.split(",").forEach((header, i) => {
  header = header.trim().toLowerCase();
  if (header.includes("max")) {
    let key = header.substr(0, header.indexOf("max"));

    console.log(key);
    if (template[key]) {
      template[key]["max"] = i;
    } else {
      template[key] = {};
      template[key]["max"] = i;
    }
  } else if (header.includes("min")) {
    let key = header.substr(0, header.indexOf("min"));
    console.log(key);
    if (template[key]) {
      template[key]["min"] = i;
    } else {
      template[key] = {};
      template[key]["min"] = i;
    }
  } else {
    template[header] = i;
  }
});
console.log(rest);
