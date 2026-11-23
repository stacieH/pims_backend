const { getProductCatalog } = require('./products_catalog.controller')

const routes = (app) => {
    // Product catalog collection
    app.route('/api/product-catalogs')
        // get list
        .get(getProductCatalog)
}

module.exports={routes}