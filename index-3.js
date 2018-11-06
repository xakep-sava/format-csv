const csv = require("csv-parser");
const fs = require("fs");

if (!fs.existsSync("output")) {
  fs.mkdirSync("output");
}

var fileName = "8.csv";
var countRow = 0;
const outputStream = fs.createWriteStream("output/" + fileName);

fs.createReadStream("input/" + fileName)
  .pipe(csv())
  .on("data", (data) => {
    countRow++;

    var keys = Object.keys(data);

    if (countRow === 1) {
      outputStream.write(keys.join(",") + "\n");
    }

    var output = keys.map((k) => {
      var currentValue = data[k].trim();

      if (currentValue.length && currentValue.indexOf('"') === -1) {
        currentValue = '"' + currentValue + '"';
      }

      return currentValue;
    }).join(",");

    outputStream.write(output + "\n");
  })
  .on("end", () => {
    console.log("Count row: " + countRow);
    console.log("Done...");

    outputStream.end();
  });