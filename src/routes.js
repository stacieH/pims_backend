const { routes: productCatalogRoutes } = require('./modules/product_catalogs/product_catalog.routes')
const { routes: productRoutes } = require('./modules/products/products.routes')

const routes = (app) => {
    productCatalogRoutes(app)
    productRoutes(app)
}

module.exports={routes}