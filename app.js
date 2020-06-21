const fs = require("fs");
let data = fs.readFileSync("input.csv", "utf8");
let [headers, ...rest] = data.split("\n");
let template = {};
headers.split(",").forEach((header, i) => {
  header = header.trim().toLowerCase();
  if (header.includes("max")) {
    let key = header.substr(0, header.indexOf("max"));

    if (template[key]) {
      template[key]["max"] = i;
    } else {
      template[key] = {};
      template[key]["max"] = i;
    }
  } else if (header.includes("min")) {
    let key = header.substr(0, header.indexOf("min"));
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
let chars = rest.map((char) => {
  let ret = {};
  char = char.split(",");
  Object.keys(template).forEach((key) => {
    if (typeof template[key] === "number") {
      ret[key] = char[template[key]];
    } else {
      ret[key] = {}
      ret[key]["min"] = char[template[key]["min"]];
      ret[key]["max"] = char[template[key]["max"]];
    }
  });
  return ret; 
});
console.log(chars[0]);
