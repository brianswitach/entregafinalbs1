class ProductDTO {
    constructor(product) {
        this.id = product._id;
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
        this.status = product.status;
        this.code = product.code;
        this.stock = product.stock;
        this.category = product.category;
        this.thumbnails = product.thumbnails;
    }
}

module.exports = ProductDTO;
