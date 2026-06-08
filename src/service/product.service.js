const productModel = require("../models/product.model");
class ProductService {
  getAll = async () => {
    return await productModel.find();
  };
  getByID = async (productId) => {
    return await productModel.findById(productId);
  };
  delete = async (productId) => {
    return await productModel.findByIdAndDelete(productId);
  };
  insert = async (product) => {
    try {
      return await productModel.create(product);
    } catch (error) {
      throw new Error(error.message);
    }
  };
  getBySlug = async (slug) => {
    return await productModel.findOne({ slug: slug });
  };
  update = async (product) => {
    const productUpdated = await productModel.findByIdAndUpdate(
      product._id,
      product,
      { new: true },
    );
    return productUpdated;
  };
}
module.exports = new ProductService();
