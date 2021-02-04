// var fs = require('fs');
// var parser = require('xml2json');

// var productPricePair = {};

// fs.readFile( './test_pricebook.xml', 'utf8', function(err, xmlData) {
//     var json = JSON.parse(parser.toJson(xmlData, {reversible: true}));
//     var priceTables = json.pricebooks.pricebook['price-tables']['price-table'];

//     priceTables.forEach(element => {
//         productPricePair[element['product-id']] = element.amount['$t'];
//     });
//     console.log(productPricePair);
// });

const pricebook = require('./pricebook');

const productPricePair = pricebook.getProductIdPricePair();
console.log(productPricePair);



