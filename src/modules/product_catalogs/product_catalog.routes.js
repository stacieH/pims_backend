const { getProductCatalog, publishProductAsCatalog, unpublishProductAsCatalog } = require('./products_catalog.controller')

const routes = (app) => {
    // Product catalog collection
    app.route('/products/catalogs')
        // get list
        .get(getProductCatalog)
    
    app.route('/products/:id/publish')
        .patch(publishProductAsCatalog)
    
    app.route('/products/:id/unpublish')
        .patch(unpublishProductAsCatalog)
}

module.exports={routes}