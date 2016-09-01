var fs = require('fs-extra');
var path = require('path');
var bigDecimal = require('big-decimal'); 
var inputFolderPath = '/Users/mateus/Documents/repositorios/github/ilegraApp/data/in/';
var outputFilePath = '/Users/mateus/Documents/repositorios/github/ilegraApp/data/out/flat_file_name.done.dat';

fs.watch(inputFolderPath, () => {
  fs.remove(outputFilePath);
  processFiles();
});

function processFiles() {
  var salesMan = 0;
  var customers = 0;
  var bigSale = bigDecimal.ZERO;
  var smallSale = bigDecimal.ZERO;

  fs.readdir( inputFolderPath, (err, files) => { 
  if (!err) {
    for(var i in files) {
      if (path.extname(files[i]) === '.dat') {
          fs.readFileSync(inputFolderPath + files[i]).toString().split('\n').forEach((line) => { 
          var sales = line.split('ç');

          switch (sales[0]) {
              case '001':
                  salesMan +=1;
                  break;
              case '002':
                  customers +=1;
                  break;
              case '003':
                var item = sales[2].replace("[", "").replace("]", "").split(",");
                var quantity = item[1].split("-");
                var price = item[2].split("-");
                var total = bigDecimal.ZERO;
                for (var i = 0; i < quantity.length; i++) {
                  var priceItem = new bigDecimal(quantity[i]).multiply(new bigDecimal(price[i]));
                  total = total.add(priceItem);
                }              

                if (total.compareTo(bigSale) == 1) {
                  bigSale = bigSale.add(total);
                  idBestSales = sales[1];
                }

                if ((total.compareTo(smallSale) == -1) || (smallSale.compareTo(bigDecimal.ZERO) == 0)) {
                  smallSale = smallSale.add(total);
                  worstSalesman = sales[3];
                }       
            }
          });
      }
    }

     fs.appendFileSync(outputFilePath, 
        'SalesMan:'+salesMan+"\n"+'Customers:'+customers+"\n"+
        'ID of the most expensive sale:'+idBestSales+"\n"+'Worst salesman ever:'+worstSalesman);      
     console.log('The file was saved!');
  }  
  else
    throw err; 
 }); 
}
