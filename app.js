const fs = require('fs-extra');
const path = require('path');
const bigDecimal = require('big-decimal'); 
const inputFolderPath = '/Users/mateus/Documents/repositorios/github/ilegraApp/data/in/';
const outputFilePath = '/Users/mateus/Documents/repositorios/github/ilegraApp/data/out/flat_file_name.done.dat';

fs.watch(inputFolderPath, () => {
  fs.remove(outputFilePath);
  processFiles();
});

function initializeVariables() {
  return  salesMan = 0, customers = 0,
          bigSale = bigDecimal.ZERO, smallSale = bigDecimal.ZERO,
          salesManData = '001', customerData = '002', salesData = '003';    
}

function endsWith(file) {
  return path.extname(file) === '.dat'
}

function processFiles() {
  initializeVariables();
  fs.readdir( inputFolderPath, (err, files) => { 
  if (!err) {
    for(var i in files) {
      if (endsWith(files[i])) {
          fs.readFileSync(inputFolderPath + files[i]).toString().split('\n').forEach((line) => { 
          var splitedLine = line.split('ç');

          switch (splitedLine[0]) {
              case salesManData:
                   salesMan +=1;
                   break;
              case customerData:
                   customers +=1;
                   break;
              case salesData:
                var item = splitedLine[2].replace("[", "").replace("]", "").split(",");
                var quantity = item[1].split("-");
                var price = item[2].split("-");
                var total = bigDecimal.ZERO;
                for (var i = 0; i < quantity.length; i++) {
                  var priceItem = new bigDecimal(quantity[i]).multiply(new bigDecimal(price[i]));
                  total = total.add(priceItem);
                }              

                if (total.compareTo(bigSale) == 1) {
                  bigSale = bigSale.add(total);
                  idBestSales = splitedLine[1];
                }

                if ((total.compareTo(smallSale) == -1) || (smallSale.compareTo(bigDecimal.ZERO) == 0)) {
                  smallSale = smallSale.add(total);
                  worstSalesman = splitedLine[3];
                }       
            }
          });
      }
    }

    var message = 'SalesMan: ' +salesMan+ '\nCustomers: ' +customers+ '\nID of the most expensive sale: ' +idBestSales+ '\nWorst salesman ever: ' +worstSalesman;
    fs.appendFileSync(outputFilePath, message);      
    console.log('The file was saved!');
  }  
  else
    throw err; 
 }); 
}
