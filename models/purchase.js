const express = require('express');
const router = express.Router();
const CartRepository = require('../repositories/CartRepository');
const ProductRepository = require('../repositories/ProductRepository');
const Ticket = require('../models/Ticket');
const { v4: uuidv4 } = require('uuid');


router.post('/:cartId', async (req, res) => {
    const { cartId } = req.params;

    try {
        const cart = await CartRepository.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        let totalAmount = 0;
        const unavailableProducts = [];

        for (const item of cart.products) {
            const product = await ProductRepository.findById(item.product._id);

            if (product && product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();

                totalAmount += product.price * item.quantity;
            } else {
                unavailableProducts.push(item.product._id);
            }
        }

        if (unavailableProducts.length > 0) {
            return res.status(400).json({
                message: 'Algunos productos no están disponibles',
                unavailableProducts
            });
        }


        const ticket = new Ticket({
            code: uuidv4(),
            amount: totalAmount,
            purchaser: req.user.email 
        });

        await ticket.save();

       
        cart.products = cart.products.filter(item => unavailableProducts.includes(item.product._id));
        await cart.save();

        res.status(201).json({ message: 'Compra realizada con éxito', ticket });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
