
const mongoose = require("mongoose");

const productCategorySchema = new mongoose.Schema(
    {
        // Unique category code
        code: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
            unique: true
        },
        // 	Category name
        name: {
            type: String,
            required: true,
            trim: true
        },
        // 	Category description
        description: {
            type: String,
            default: null,
            trim: true
        },
        // 	Parent category reference
        parent_category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product_categories",
            default: null
        },
        // Category image
        image_url: {
            type: String,
            default: null
        },
        // Hierarchy depth
        level: {
            type: Number,
            default: 0,
            min: 0
        },
        // Category hierarchy path
        path: {
            type: String,
            default: null
        },
        // Display ordering
        sortOrder: {
            type: Number,
            default: 0
        },
        // ACTIVE / INACTIVE
        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE"
        },
        // Soft deletion
        is_deleted: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const ProductCategory = mongoose.model('product_categories', productCategorySchema )

module.exports = { ProductCategory }
