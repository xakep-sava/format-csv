const csv = require('csv-parser');
const fs = require('fs');

const outputStream = fs.createWriteStream("output/1.csv");
var countRow = 0;

fs.createReadStream('input/1.csv')
  .pipe(csv())
  .on('data', (data) => {
    countRow++;

    var keys = Object.keys(data);

    if (countRow === 1) {
      outputStream.write(keys.join(",") + "\n");
    }

    var output = keys.map((k) => {
      var currentValue = data[k];

      if (currentValue) {
        currentValue = formatUl(currentValue, ',');
        currentValue = formatUl(currentValue, '\n');

        if (currentValue.indexOf(' ') > -1) {
          currentValue = '"' + currentValue + '"';
        }
      } else {
        currentValue = '';
      }

      return currentValue;
    }).join(",");

    outputStream.write(output + "\n");
  })
  .on('end', () => {
    console.log('Count row: ' + countRow);
    console.log('Done...');

    outputStream.end();
  });

function formatUl(str, spliceSymbol) {
  if (str.indexOf(spliceSymbol) > -1) {
    str = '<ul>' + str.split(spliceSymbol).map((val) => {
      return '<li>' + val.trim() + '</li>';
    }) + '</ul>';
  }

  return str;
}