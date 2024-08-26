const Product = require('../models/Product');

class ProductRepository {
    async findAll(filters, limit, skip) {
        return await Product.find(filters)
            .limit(limit)
            .skip(skip)
            .exec();
    }

    async findById(id) {
        return await Product.findById(id);
    }

    async create(productData) {
        const product = new Product(productData);
        return await product.save();
    }

    async update(id, updateData) {
        return await Product.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }
}

module.exports = new ProductRepository();
