const {
    getProducts, 
    getProductById, 
    deleteProduct, 
    updateProduct,
    addNewProductItem
} = require('./products.controller')

const routes = (app) => {
    // Product collection
    app.route('/products')
        // get list
        .get(getProducts)
        // create
        .post(addNewProductItem)
        
    // Individual product
    app.route('/products/:id')
        // get specific product
        .get(getProductById)
        // updating specific product
        .put(updateProduct)
        // updating specific product
        .patch(updateProduct)
        // deleting specific product
        .delete(deleteProduct)
}

module.exports={routes}