const express = require('express');
const router = express.Router();
const Cart = require('../models/cart'); 

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


router.post('/:cartId/products/:productId', getCart, async (req, res) => {
    const { cartId, productId } = req.params;

    if (!res.cart.products.includes(productId)) {
        res.cart.products.push(productId);
    }

    try {
        const updatedCart = await res.cart.save();
        res.json(updatedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.delete('/:cartId/products/:productId', getCart, async (req, res) => {
    const { cartId, productId } = req.params;

    res.cart.products = res.cart.products.filter(id => id != productId);

    try {
        const updatedCart = await res.cart.save();
        res.json(updatedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


async function getCart(req, res, next) {
    let cart;
    try {
        cart = await Cart.findById(req.params.cartId).populate('products');
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
