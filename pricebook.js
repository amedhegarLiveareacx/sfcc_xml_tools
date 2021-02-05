var fs = require('fs');
var parser = require('xml2json');

class PriceBookParser {
    constructor() {
        this.pricebookFileName = './pricebooks/usd_list/xaa.xml'; // './test_pricebook.xml';
        this.catalogPriceBook = './catalogs/dev08_NA_master_catalog.xml'; // './test_catalog.xml';
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

    generateCatalogProductPair() {
        var catalogProductPair = {};
        var xmlData = fs.readFileSync(this.catalogPriceBook, 'utf8');
        if (xmlData) {
            var json = JSON.parse(parser.toJson(xmlData, {reversible: true}));
            json.catalog.product.forEach(element => {
                catalogProductPair[element['product-id']] = 0;
            });            
        }
        this.writeCatalogPriceBookToFile(catalogProductPair);
    }

    readCatalogPriceBookFromFile() {
        var data = fs.readFileSync('pricebookpair.json', 'utf8');
        return data ? JSON.parse(data) : [];
    }

    writeCatalogPriceBookToFile(records) {
        fs.writeFileSync('pricebookpair.json', JSON.stringify(records));
    }

    generateProductPricePair() {
        const productPricePair = this.getProductIdPricePair();
        const catalogProductPair = this.readCatalogPriceBookFromFile();

        for (const key in catalogProductPair) {
            if (Object.hasOwnProperty.call(catalogProductPair, key)) {
                // const element = catalogProductPair[key];
                if (productPricePair[key]) {
                    catalogProductPair[key] = productPricePair[key];
                }
            }
        }
        this.writeCatalogPriceBookToFile(catalogProductPair);
    }
}

module.exports = new PriceBookParser();