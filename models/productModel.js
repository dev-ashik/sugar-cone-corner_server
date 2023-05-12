const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type:String
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.ObjectId,
        ref: "category",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    shipping: {
        type:Boolean,
    }
}, {timestamps: true})


module.exports = mongoose.model("products", productSchema);