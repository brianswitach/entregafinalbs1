const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/product');

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    const cart = new Cart({
        products: []
    });

    try {
        const newCart = await cart.save();
        res.status(201).json(newCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Obtener un carrito por ID
router.get('/:cartId', getCart, (req, res) => {
    res.json(res.cart);
});

// Actualizar un carrito
router.put('/:cartId', getCart, async (req, res) => {
    const { products } = req.body;
    res.cart.products = products;

    try {
        const updatedCart = await res.cart.save();
        res.json(updatedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Eliminar un carrito
router.delete('/:cartId', getCart, async (req, res) => {
    try {
        await res.cart.remove();
        res.json({ message: 'Carrito eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Agregar un producto a un carrito
router.post('/:cartId/products/:productId', getCart, async (req, res) => {
    const { productId } = req.params;

    const product = res.cart.products.find(p => p.product.toString() === productId);

    if (product) {
        product.quantity += 1;
    } else {
        res.cart.products.push({ product: productId, quantity: 1 });
    }

    try {
        const updatedCart = await res.cart.save();
        res.json(updatedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Actualizar la cantidad de un producto en un carrito
router.put('/:cartId/products/:productId', getCart, async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    const product = res.cart.products.find(p => p.product.toString() === productId);

    if (product) {
        product.quantity = quantity;
    } else {
        return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    try {
        const updatedCart = await res.cart.save();
        res.json(updatedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Eliminar un producto de un carrito
router.delete('/:cartId/products/:productId', getCart, async (req, res) => {
    const { productId } = req.params;

    res.cart.products = res.cart.products.filter(p => p.product.toString() !== productId);

    try {
        const updatedCart = await res.cart.save();
        res.json(updatedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Middleware para obtener un carrito por ID
async function getCart(req, res, next) {
    let cart;
    try {
        cart = await Cart.findById(req.params.cartId);
        if (cart == null) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.cart = cart;
    next();
}

module.exports = router;
