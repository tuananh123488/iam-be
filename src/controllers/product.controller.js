"use strict";
const ProductService = require("../service/product.service");

class ProductController {
  getAll = async (req, res) => {
    try {
      const products = await ProductService.getAll();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  delete = async (req, res) => {
    try {
      const productId = req.params._id;
      const deletedProduct = await ProductService.delete(productId);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  insert = async (req, res) => {
    try {
      const product = req.body;

      const newProduct = await ProductService.insert(product);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  getBySlug = async (req, res) => {
    try {
      const slug = req.params.slug;
      console.log(slug);

      const product = await ProductService.getBySlug(slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  update = async (req, res) => {
    try {
      const product = req.body;
      const updatedProduct = await ProductService.update(product);
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
module.exports = new ProductController();
