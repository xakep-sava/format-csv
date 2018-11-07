const csv = require("csv-parser");
const fs = require("fs");

if (!fs.existsSync("output")) {
  fs.mkdirSync("output");
}

var fileName = "9.csv";
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

      if (currentValue.length) {
        currentValue = '"' + escapeHtml(currentValue) + '"';
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

function escapeHtml(string) {
  return string.replace('"', '""');
}