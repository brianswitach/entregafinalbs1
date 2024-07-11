const express = require('express');
const router = express.Router();
const Product = require('../models/product');


router.get('/', async (req, res) => {
    const { page = 1, limit = 10, name, price } = req.query;
    const filters = {};
    if (name) filters.name = name;
    if (price) filters.price = price;

    try {
        const products = await Product.find(filters)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await Product.countDocuments(filters);

        res.json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/:id', getProduct, (req, res) => {
    res.json(res.product);
});


router.post('/', async (req, res) => {
    const { name, description, price, status, code, stock, category, thumbnails } = req.body;
    const product = new Product({
        name,
        description,
        price,
        status,
        code,
        stock,
        category,
        thumbnails
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.put('/:id', getProduct, async (req, res) => {
    const { name, description, price, status, code, stock, category, thumbnails } = req.body;
    if (name != null) res.product.name = name;
    if (description != null) res.product.description = description;
    if (price != null) res.product.price = price;
    if (status != null) res.product.status = status;
    if (code != null) res.product.code = code;
    if (stock != null) res.product.stock = stock;
    if (category != null) res.product.category = category;
    if (thumbnails != null) res.product.thumbnails = thumbnails;

    try {
        const updatedProduct = await res.product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.delete('/:id', getProduct, async (req, res) => {
    try {
        await res.product.remove();
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


async function getProduct(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.params.id);
        if (product == null) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.product = product;
    next();
}

module.exports = router;
