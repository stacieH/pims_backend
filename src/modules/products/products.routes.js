const {
    getProducts, 
    getProductById, 
    softDeleteProduct, 
    updateProduct,
    addNewProductItem, 
    publishProductAsCatalog, 
    unpublishProductAsCatalog
} = require('./products.controller')

const routes = (app) => {
    // Product collection
    app.route('/api/products')
        // get list
        .get(getProducts)
        // create
        .post(addNewProductItem)
        
    // Individual product
    app.route('/api/products/:id')
        // get specific product
        .get(getProductById)
        // updating specific product
        // .put(updateProduct)
        // updating specific product
        .patch(updateProduct)
        // deleting specific product
        .delete(softDeleteProduct)
        // .delete(deleteProduct)

    app.route('/api/products/:id/publish')
        .patch(publishProductAsCatalog)
    
    app.route('/api/products/:id/unpublish')
        .patch(unpublishProductAsCatalog)
}

module.exports={routes}