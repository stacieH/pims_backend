const { handleSearchQueries } = require('../../helpers/search');
const { ProductMaster} = require('../products/products.model');

// Get all product catalogs
const getProductCatalog = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search_value
        } = req.query;

        const queries = handleSearchQueries({
            // tenantId: req.user.tenantId,
            'catalog.is_published': true,
            status: 'active',
            search_keys:"sku,name", 
            search_value
        });

        console.log("queries", queries)

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


const publishProductAsCatalog = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await ProductMaster.findOne({
            _id: id,
            // tenantId: req.user.tenantId
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.catalog?.is_published) {
            return res.status(400).json({
                success: false,
                message: 'Product is already published'
            });
        }

        product.catalog = {
            ...product.catalog?.toObject?.(),
            is_published: true,
            published_at: new Date(),
            unpublished_at: null
        };

        await product.save();

        return res.status(200).json({
            success: true,
            message: 'Product published successfully',
            data: product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to publish product',
            error: error.message
        });
    }
};

const unpublishProductAsCatalog = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await ProductMaster.findOne({
            _id: id,
            // tenantId: req.user.tenantId
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (!product.catalog?.is_published) {
            return res.status(400).json({
                success: false,
                message: 'Product is already unpublished'
            });
        }

        product.catalog.is_published = false;
        product.catalog.unpublished_at = new Date();

        await product.save();

        return res.status(200).json({
            success: true,
            message: 'Product unpublished successfully',
            data: product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to unpublish product',
            error: error.message
        });
    }
};

module.exports = { getProductCatalog, publishProductAsCatalog, unpublishProductAsCatalog }