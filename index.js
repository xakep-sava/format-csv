const csv = require("csv-parser");
const fs = require("fs");

if (!fs.existsSync("output")) {
  fs.mkdirSync("output");
}

var fileName = "1.csv";
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

      if (currentValue) {
        if (currentValue.indexOf("\n") > -1) {
          currentValue = wrapTag(currentValue, "\n");
        } else if (currentValue.indexOf("\r") > -1) {
          currentValue = wrapTag(currentValue, "\r");
        } else if (currentValue.indexOf("\r\n") > -1) {
          currentValue = wrapTag(currentValue, "\r\n");
        } else if (currentValue.indexOf(",") > -1) {
          currentValue = wrapTag(currentValue, ",");
        }

        if (currentValue.indexOf(" ") > -1) {
          currentValue = '"' + escapeHtml(currentValue) + '"';
        }
      } else {
        currentValue = "";
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

function wrapTag(str, spliceSymbol) {
  if (str.indexOf(spliceSymbol) > -1) {
    str = "<ul>" + str.split(spliceSymbol).map((val) => {
      var valTrim = val.trim();

      if (valTrim.length) {
        valTrim = "<li>" + val.trim() + "</li>";
      }

      return valTrim;
    }) + "</ul>";
  }

  return str.replace(/[,]/g, "");
}

function escapeHtml(string) {
  return String(string).replace(/["]/g, (s) => {
    return "&quot;";
  });
}