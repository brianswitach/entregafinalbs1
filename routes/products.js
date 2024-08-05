const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Obtener todos los productos con paginación y filtros
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

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (product == null) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
    const { name, description, price, code, stock, category, thumbnails } = req.body;
    const product = new Product({
        name,
        description,
        price,
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

// Actualizar un producto
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        Object.assign(product, req.body);

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        await product.remove();
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
