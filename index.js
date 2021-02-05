const pricebook = require('./pricebook');
pricebook.generateCatalogProductPair('usd_list');
pricebook.generateProductPricePair('usd_list');
pricebook.generatePricebookXml('usd_list');


pricebook.generateCatalogProductPair('usd_sale');
pricebook.generateProductPricePair('usd_sale');
pricebook.generatePricebookXml('usd_sale');
