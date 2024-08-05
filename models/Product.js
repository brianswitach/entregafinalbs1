const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: [String], default: [] }
});

module.exports = mongoose.model('Product', productSchema);
