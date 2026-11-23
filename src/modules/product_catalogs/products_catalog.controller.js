const { handleSearchQueries } = require('../../helpers/search');
const { ProductMaster} = require('../products/products.model');

// Get all product catalogs
const getProductCatalog = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search_keys,
            search_value
        } = req.query;

        const queries = handleSearchQueries({
            // tenantId: req.user.tenantId,
            'catalog.is_published': true,
            status: 'active',
            search_keys, 
            search_value
        });

        const products = await ProductMaster.find(queries)
            .sort({ 'catalog.published_at': -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await ProductMaster.countDocuments(queries);

        return res.status(200).json({
            success: true,
            data: products,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve product catalog',
            error: error.message
        });
    }
};

module.exports = { getProductCatalog }