class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.products = cart.products.map(product => ({
            productId: product.product._id,
            name: product.product.name,
            quantity: product.quantity,
            price: product.product.price
        }));
    }
}

module.exports = CartDTO;
