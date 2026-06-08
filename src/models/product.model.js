const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: {
    priceOne: { type: Number, required: true },
    priceTwo: { type: Number, required: true },
    priceThree: { type: Number, required: true },
    priceLitle: { type: Number },
  },
  description: { type: String, required: true },
  image: { type: String, required: true },
  imageBg: { type: String, required: true },
  interfaces: { type: [String], required: true },
  functions: [
    {
      image: { type: String, required: true, default: "" },
      title: { type: String, required: true, default: "" },
      description: { type: String, required: true, default: "" },
    },
  ],

  slug: { type: String, required: true, unique: true },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
