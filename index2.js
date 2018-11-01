const csv = require("csv-parser");
const fs = require("fs");

if (!fs.existsSync("output")) {
  fs.mkdirSync("output");
}

var fileName = "7.csv";
var countRow = 0;
const outputStream = fs.createWriteStream("output/" + fileName);
let rows = [];
let columns = [];

fs.createReadStream("input/" + fileName)
  .pipe(csv())
  .on("data", (data) => {
    countRow++;

    let keys = Object.keys(data);

    if (countRow === 1) {
      outputStream.write(keys.join(",") + "\n");
    }

    rows.push(data[keys[0]].trim());
    columns.push(data[keys[1]].trim());

    //data[keys[1]].trim().split('\n')

    outputStream.write(output + "\n");
  })
  .on("end", () => {
    console.log("Count row: " + countRow);
    console.log("Done...");

    outputStream.end();
  });