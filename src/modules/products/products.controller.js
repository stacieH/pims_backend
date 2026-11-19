const mongoose = require('mongoose');
const { ProductMaster} = require('./products.model');
const { handleSearchQueries } = require('../../helpers/search');
const { singleSorting } = require('../../helpers/sorting');

// Add new product
const addNewProductItem = async (req,res) => {
    try{
        let newProduct = await ProductMaster.create(req.body)
        res.status(201).json({
            status: 201,
            data: newProduct,
            message: "Successfully created."

        })
    }
    catch(err){
        res.status(400).json({
            status: 400,
            message: "Failed to create product item",
            error: err.message
        })
    }
}

// Get all productss
const getProducts = async (req, res) => {
    try{
        const {
            search_keys=[],
            search_value,
            sku,
            name,
            status,
            page = 1,
            limit = 10,
            sort_by,
            sort_order
        } = req.query;

        const queries = handleSearchQueries({
            search_keys: search_keys||[],
            search_value,
            sku,
            name,
            status,
        })

        // Allowed sorting fields
        const allowedSortKeys = [
            'name',
            'sku',
            'price',
            'status',
            'createdAt',
            'updatedAt'
        ];

        const {sortKey, sortDirection} = singleSorting({
            sort_keys: allowedSortKeys,
            sort_by,
            sort_order
        })

        const sortOptions = {
            [sortKey]: sortDirection
        };

        // Pagination
        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const pageLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
        const skip = (pageNumber - 1) * pageLimit;

        const [products, total] = await Promise.all([
            ProductMaster.find(queries)
                .sort(sortOptions)
                .skip(skip)
                .limit(pageLimit),

            ProductMaster.countDocuments(queries)
        ]);

        res.status(200).json({
            status: 200,
            data: products,
            pagination: {
                total,
                page: pageNumber,
                limit: pageLimit,
                totalPages: Math.ceil(total / pageLimit)
            },
            sorting: {
                sort_by: sortKey,
                sort_order: sortDirection === 1 ? 'asc' : 'desc'
            },
            message: "Successfully fetched list."
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: "Failed to retrieve products",
            error:err.message
        })
    }
}

// Get product by ID
const getProductById = async (req, res) => {
    try{
        const id = req.params.id
        const member = await ProductMaster.findById(id)

        if(!member){
            return res.status(404).json({
                status: 404,
                message: "Product not found"
            })
        }

        res.status(200).json({
            status: 200,
            data: member,
            message: "Successfully fetched details"
        })
    }
    catch(err){
        res.status(400).json({
            status: 400,
            message: "Invalid product ID",
            error: err.message
        })
    }
}

// Update product
const updateProduct = async (req, res) => {
    try{
        const id = req.params.id
        const body = req.body


        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid product ID"
            });
        }

        // Allowed fields for updating
        const allowedFields = [
            'productName',
            'sku',
            'description',
            'price',
            'quantity',
            'images',
            'status'
        ];

        const updates = {};

        // Only accept allowed fields
        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updates[field] = body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                status: 400,
                message: "No valid fields provided for update"
            });
        }

        const options = {
            new: true,
            runValidators: true
        }
        const product = await ProductMaster.findByIdAndUpdate(id, { $set: updates }, options)

        if(!product){
            return res.status(404).json({
                message: "Product not found"
            })
        }
        
        res.status(200).json({
            status: 200,
            data: product,
            message: "Successfully updated"
        })
    }
    catch(err){
        // Handle duplicate SKU
        if (err.code === 11000) {
            return res.status(409).json({
                status: 409,
                message: "SKU already exists",
                error: err.keyValue
            });
        }
        
        res.status(400).json({
            status: 400,
            message: "Failed to update product",
            error: err.message
        })
    }
}

// Delete product
const deleteProduct = async (req, res) => {
    try{
        const id = req.params.id
        const member = await ProductMaster.findByIdAndDelete(id)

        if(!member){
            return res.status(404).json({
                status: 404,
                message: "Product not found"
            })
        }

        res.status(200).json({
            status: 200,
            message: "Successfully deleted product"
        })
    }
    catch(err){
        res.status(400).json({
            status: 400,
            message: "Failed to delete product",
            error: err.message
        })
    }
}

module.exports = {
    getProducts, 
    getProductById, 
    deleteProduct, 
    updateProduct,
    addNewProductItem
}