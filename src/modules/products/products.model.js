const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    sku:{
        type: String,
        required: [true, 'SKU is missing'],
        trim: true,
        unique: true,
        uppercase: true,
    },
    name:{
        type: String,
        required: [true, 'Product Name is missing'],
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product_categories',
        default: null
    },
    short_description:{
        type: String,
        trim: true,
        default: null
    },
    description: {
        type: String,
        trim: true,
        default: null
    },
    images:{
        type: [{
            url: {
                type: String,
                required: true,
                trim: true
            },
            alt: String,
            is_primary: {
                type: Boolean,
                default: false
            },
            uploaded_at: {
                type: Date,
                default: Date.now
            }
        }],
        default: null
    },
    price:{
        type: Number,
        required: true,
        min: 0
    },
    barcode:{
        type: [String],
        default: null
    }, 
    // Product Ingredients
    ingredients: {
        type: [{
            name: {
                type: String,
                required: true,
                trim: true
            },
            quantity: {
                type: Number,
                default: null,
                min: 0
            },
            unit: {
                type: String,
                trim: true,
                default: null
            }
        }],
        default: []
    },
    // Cooking Instructions
    cooking_instructions: {
        type: [{
            step: {
                type: Number,
                required: true,
                min: 1
            },
            instruction: {
                type: String,
                required: true,
                trim: true
            },
            image_url: {
                type: String,
                default: null
            }
        }],
        default: []
    },
    // Product Catalog Settings
    catalog: {
        is_published: {
            type: Boolean,
            default: false
        },
        published_at: {
            type: Date,
            default: null
        },
        unpublished_at: {
            type: Date,
            default: null
        }
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE',
        required: true
    },
}, {
    timestamps: true,
    versionKey: false
})

const ProductMaster = mongoose.model('products', ProductSchema )

module.exports = { ProductMaster }