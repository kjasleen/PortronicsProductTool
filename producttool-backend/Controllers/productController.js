const Product = require('../Models/product');

exports.createProduct = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim().length < 3) {
    return res.status(400).json({ message: 'Product name is required and should be at least 3 characters' });
  }

  try {
    const existing = await Product.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Product already exists' });

    const product = await Product.create({ name });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
