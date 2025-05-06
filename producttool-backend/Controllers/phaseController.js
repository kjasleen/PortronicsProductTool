const Phase = require('../Models/phase');
const Product = require('../Models/product');
const updateProductStatus = require('../Utils/updateProductStatus');


exports.createPhase = async (req, res) => {
  const { name, productId } = req.body;

  if (!name || name.trim().length < 3) {
    return res.status(400).json({ message: 'Phase name must be at least 3 characters' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const phase = await Phase.create({ name: name.trim(), product: productId });
    await updateProductStatus(productId);

    res.status(201).json(phase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePhase = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Phase.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Phase not found' });
    res.json({ message: 'Phase deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPhasesByProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const phases = await Phase.find({ product: productId }).sort({ createdAt: -1 });
    res.json(phases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
