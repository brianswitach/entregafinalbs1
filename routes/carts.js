const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

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
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Actualizar un carrito
router.put('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        Object.assign(cart, req.body);

        const updatedCart = await cart.save();
        res.json(updatedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Eliminar un carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        await cart.remove();
        res.json({ message: 'Carrito eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Agregar un producto a un carrito
router.put('/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;

    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex === -1) {
            cart.products.push({ product: productId, quantity: 1 });
        } else {
            cart.products[productIndex].quantity += 1;
        }

        const updatedCart = await cart.save();
        res.json(updatedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Eliminar un producto de un carrito
router.delete('/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;

    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        cart.products = cart.products.filter(p => p.product.toString() !== productId);

        const updatedCart = await cart.save();
        res.json(updatedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
