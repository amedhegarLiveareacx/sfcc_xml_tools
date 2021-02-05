var fs = require('fs');
const path = require('path');
var parser = require('xml2json');
const directoryPath = path.join(__dirname, 'pricebooks', 'usd_list');

class PriceBookParser {
    constructor() {
        this.pricebookFileName = './pricebooks/usd_list/xaa.xml'; // './test_pricebook.xml';
        this.catalogPriceBook = './catalogs/dev08_NA_master_catalog.xml'; // './test_catalog.xml';
    }
    // This method generate key value pair from the pricebooks file
    getProductIdPricePair(filename) {
        var productPricePair = {};
        var xmlData = fs.readFileSync(filename, 'utf8');
        if (xmlData) {
            var json = JSON.parse(parser.toJson(xmlData, {reversible: true}));
            var priceTables = json.pricebooks.pricebook['price-tables']['price-table'];        
            priceTables.forEach(element => {
                productPricePair[element['product-id']] = element.amount['$t'];
            });
        }
        return productPricePair;
    }

    // This method generate key value pair from the catalog file
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

    // Read the data from the file
    readCatalogPriceBookFromFile() {
        var data = fs.readFileSync('pricebookpair.json', 'utf8');
        return data ? JSON.parse(data) : [];
    }

    // write the data to file
    writeCatalogPriceBookToFile(records) {
        fs.writeFileSync('pricebookpair.json', JSON.stringify(records));
    }

    // This method sets the corresponding price to the key value pair and write the data back to file
    generateProductPricePair() {
        const filenames = fs.readdirSync(directoryPath);
        if(filenames) {
            filenames.forEach((filename) => {
                const catalogProductPair = this.readCatalogPriceBookFromFile();
                console.log(`===============Reading the file:: ${filename} ===================`)
                const productPricePair = this.getProductIdPricePair(path.join(directoryPath, filename));
                for (const key in catalogProductPair) {
                    if (Object.hasOwnProperty.call(catalogProductPair, key)) {
                        // const element = catalogProductPair[key];
                        if (productPricePair[key]) {
                            catalogProductPair[key] = productPricePair[key];
                        }
                    }
                }
                this.writeCatalogPriceBookToFile(catalogProductPair);
                console.log(`===============Finished reading the file:: ${filename} ===================`);
            });
        }
    }
}

module.exports = new PriceBookParser();