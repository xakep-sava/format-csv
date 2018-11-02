const csv = require("csv-parser");
let csvWriter = require("csv-write-stream");
const fs = require("fs");

if (!fs.existsSync("output")) {
  fs.mkdirSync("output");
}

var fileName = "7.csv";
var countRow = 0;
const outputStream = fs.createWriteStream("output/" + fileName);
let rows = [];
let columns = ["SKU"];

fs.createReadStream("input/" + fileName)
  .pipe(csv())
  .on("data", data => {
    countRow++;

    let keys = Object.keys(data);

    rows[countRow] = [];
    rows[countRow]["SKU"] = data[keys[0]].trim();

    let currentRecords = data[keys[1]].trim().split("\n");
    currentRecords.forEach(col => {
      try {
        if (!col.length) {
          return;
        }

        let currentRecord = col.split(":");
        let currentCol = currentRecord[0].trim().replace(":", "");
        let currentVal = currentRecord[1].trim();

        if (columns.indexOf(currentCol) === -1) {
          columns.push(currentCol);
        }

        rows[countRow][currentCol] = currentVal;
      } catch (e) {
        console.log(e);
      }
    });
  })
  .on("end", () => {
    console.log("Count row: " + countRow);
    console.log("Done...");

    var writer = csvWriter({
      separator: ",",
      newline: "\n",
      headers: columns
    });

    writer.pipe(outputStream);

    rows.forEach(row => {
      writer.write(Object.assign({}, row));
    });

    writer.end();
  });
