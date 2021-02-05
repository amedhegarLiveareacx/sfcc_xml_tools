var fs = require('fs');
const path = require('path');
var parser = require('xml2json');

class PriceBookParser {
    constructor() {
        this.catalogPriceBook = './catalogs/dev08_NA_master_catalog.xml'; // './test_catalog.xml';
    }
    // This method generate key value pair from the pricebooks file
    getProductIdPricePair(filename) {
        var productPricePair = {};
        var xmlData = fs.readFileSync(filename, 'utf8');
        if (xmlData) {
            var json = JSON.parse(parser.toJson(xmlData, { reversible: true }));
            var priceTables = json.pricebooks.pricebook['price-tables']['price-table'];
            priceTables.forEach(element => {
                productPricePair[element['product-id']] = element.amount['$t'];
            });
        }
        return productPricePair;
    }

    // This method generate key value pair from the catalog file
    generateCatalogProductPair(priceBookType) {
        console.log("=====================Generating catalog product pair==============");
        var catalogProductPair = {};
        const filename = priceBookType + '_pricebookpair.json';
        var xmlData = fs.readFileSync(this.catalogPriceBook, 'utf8');
        if (xmlData) {
            var json = JSON.parse(parser.toJson(xmlData, { reversible: true }));
            json.catalog.product.forEach(element => {
                catalogProductPair[element['product-id']] = 0;
            });
        }
        this.writeDataToFile(catalogProductPair, filename);
        console.log("=====================Finished generating catalog product pair==============");
    }

    // Read the data from the file
    readCatalogPriceBookFromFile(priceBookType) {
        const filename = priceBookType + '_pricebookpair.json';
        var data = fs.readFileSync(filename, 'utf8');
        return data ? JSON.parse(data) : [];
    }

    // write the data to file
    writeDataToFile(records, filename) {
        fs.writeFileSync(filename, JSON.stringify(records));
    }

    // This method sets the corresponding price to the key value pair and write the data back to file
    generateProductPricePair(priceBookType) {
        const priceBookPairFileName = priceBookType + '_pricebookpair.json';
        const directoryPath = path.join(__dirname, 'pricebooks', priceBookType);
        const filenames = fs.readdirSync(directoryPath);
        if (filenames) {
            filenames.forEach((filename) => {
                const catalogProductPair = this.readCatalogPriceBookFromFile(priceBookType);
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
                this.writeDataToFile(catalogProductPair, priceBookPairFileName);
                console.log(`===============Finished reading the file:: ${filename} ===================`);
            });
        }
    }

    generatePricebookXml(priceBookType) {
        const catalogProductPair = this.readCatalogPriceBookFromFile(priceBookType);
        const finalPriceBookFileName = priceBookType === 'usd_list' ? 'USD-list.xml' : 'USD-sale.xml';
        var priceXml = '';
        if (priceBookType === 'usd_list') {
            priceXml += `<?xml version="1.0" encoding="UTF-8"?><pricebooks xmlns="http://www.demandware.com/xml/impex/pricebook/2006-10-31"><pricebook><header pricebook-id="USD-list"><currency>USD</currency><online-flag>true</online-flag><feed-based>true</feed-based></header><price-tables>`;
        } else {
            priceXml += `<?xml version="1.0" encoding="UTF-8"?><pricebooks xmlns="http://www.demandware.com/xml/impex/pricebook/2006-10-31"><pricebook><header pricebook-id="USD-sale"><currency>USD</currency><online-flag>true</online-flag><parent>USD-list</parent><feed-based>true</feed-based></header><price-tables>`;
        }

        for (const key in catalogProductPair) {
            if (Object.hasOwnProperty.call(catalogProductPair, key)) {
                priceXml += `<price-table product-id="${key}"><amount quantity="1">${catalogProductPair[key]}</amount></price-table>`
            }
        }
        priceXml += `</price-tables></pricebook></pricebooks>`;
        this.writeDataToFile(priceXml, finalPriceBookFileName);
    }
}

module.exports = new PriceBookParser();