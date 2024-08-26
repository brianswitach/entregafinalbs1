const Cart = require('../models/Cart');

class CartRepository {
    async findById(id) {
        return await Cart.findById(id).populate('products.product');
    }

    async create(cartData) {
        const cart = new Cart(cartData);
        return await cart.save();
    }

    async update(id, updateData) {
        return await Cart.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await Cart.findByIdAndDelete(id);
    }

    async addProduct(cartId, productId) {
        const cart = await Cart.findById(cartId);
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex === -1) {
            cart.products.push({ product: productId, quantity: 1 });
        } else {
            cart.products[productIndex].quantity += 1;
        }

        return await cart.save();
    }

    async removeProduct(cartId, productId) {
        const cart = await Cart.findById(cartId);
        cart.products = cart.products.filter(p => p.product.toString() !== productId);
        return await cart.save();
    }
}

module.exports = new CartRepository();
