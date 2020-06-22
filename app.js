// lists have to be separated by semi-colon, even single items
// region must be called region
//
const fs = require("fs");
const inquirer = require("inquirer");
let data = fs.readFileSync("input.csv", "utf8");
let [headers, ...rest] = data.split("\n");
let template = {};
headers.split(",").forEach((header, i) => {
  header = header.trim().toLowerCase();
  if (header.includes("max")) {
    let key = header.substr(0, header.indexOf("max")).trim();

    if (template[key]) {
      template[key]["max"] = i;
    } else {
      template[key] = {};
      template[key]["max"] = i;
    }
  } else if (header.includes("min")) {
    let key = header.substr(0, header.indexOf("min")).trim();
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
let chars = rest
  .map((char) => {
    let ret = {};
    char = char.split(",");
    Object.keys(template).forEach((key) => {
      if (typeof template[key] === "number") {
        let prop = char[template[key]];
        if (prop && prop.includes(";")) {
          ret[key] = prop
            .split(";")
            .map((e) => e.trim())
            .filter((e) => e);
        } else {
          ret[key] = prop;
        }
      } else {
        ret[key] = {};
        ret[key]["min"] = char[template[key]["min"]];
        ret[key]["max"] = char[template[key]["max"]];
      }
    });
    if (ret.name) return ret;
  })
  .filter((e) => e);

let regions = [];
chars.forEach((char) => {
  regions.push(...char.region);
});
regions = regions.filter((e, i) => i === regions.indexOf(e));
let regionChars = {};
regions.forEach((r) => {
  let cs = chars.filter((e) => e.region.includes(r));
  regionChars[r] = cs;
});
function ask() {
  inquirer
    .prompt([
      {
        name: "region",
        message: "Which region? ",
        type: "list",
        choices: [... regions,"quit" ],
      },
    ])
    .then((answers) => {
			if(answers.region === 'quit') return;
      let char = getCharByRegion(answers.region);
      console.log(char);
      console.log("Roll: " + getDiceRoll(char["dicecalc"]));
      ask();
    });
}
function getCharByRegion(region) {
  let char = getRandomFromArray(regionChars[region]);
  let ret = {};
  Object.keys(char).forEach((key) => {
    if (typeof char[key] === "object") {
      if (char[key].length !== undefined) {
        ret[key] = getRandomFromArray(char[key]);
      } else {
        ret[key] = getRndInteger(char[key].min, char[key].max);
      }
    } else {
      ret[key] = char[key];
    }
  });
  return ret;
}
function getRandomFromArray(array) {
  return array[getRndInteger(0, array.length - 1)];
}
function getRndInteger(min, max) {
  // min and max included
  min = +min;
  max = +max;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getDiceRoll(formula) {
  let one = formula.split("d");
  let two = one[1].split("+");
  let three = [one[0], ...two];
  three = three.map((e) => +e);
  if (!three[2]) three[2] = 0;
  let sum = 0;
  while (three[0]-- > 0) {
    sum += getRndInteger(1, three[1]);
  }
  return sum + three[2];
}
ask();
