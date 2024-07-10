const express = require('express');
const router = express.Router();
const Product = require('../models/product'); 


router.get('/', async (req, res) => {
    const { page = 1, limit = 10, name, price } = req.query;
    const filters = {};
    if (name) filters.name = new RegExp(name, 'i');
    if (price) filters.price = price;

    try {
        const products = await Product.find(filters)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .exec();
        const count = await Product.countDocuments(filters);

        res.json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/', async (req, res) => {
    const { name, description, price } = req.body;
    const product = new Product({
        name,
        description,
        price
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.put('/:id', getProduct, async (req, res) => {
    if (req.body.name != null) {
        res.product.name = req.body.name;
    }
    if (req.body.description != null) {
        res.product.description = req.body.description;
    }
    if (req.body.price != null) {
        res.product.price = req.body.price;
    }

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

