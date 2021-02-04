var fs = require('fs');
var parser = require('xml2json');

class PriceBookParser {
    constructor() {
        this.pricebookFileName = './test_pricebook.xml';
        this.catalogPriceBook = '';
    }
    getProductIdPricePair() {
        var productPricePair = {};
        var xmlData = fs.readFileSync(this.pricebookFileName, 'utf8');
        if (xmlData) {
            var json = JSON.parse(parser.toJson(xmlData, {reversible: true}));
            var priceTables = json.pricebooks.pricebook['price-tables']['price-table'];        
            priceTables.forEach(element => {
                productPricePair[element['product-id']] = element.amount['$t'];
            });
        }
        return productPricePair;
    }

    // getCatalogProductList(filename) {

    // }
}


module.exports = new PriceBookParser();