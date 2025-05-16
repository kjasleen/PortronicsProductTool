const Product = require('../Models/product');
const Phase = require('../Models/phase');
const Task = require('../Models/task');

exports.getProductReport  = async (req, res) => {
  try {
    const { productId } = req.params;

    // Fetch product data
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Fetch all phases related to the product
    const phases = await Phase.find({ product: productId });

    // Fetch all tasks related to those phases
    const tasks = await Task.find({ phase: { $in: phases.map(phase => phase._id) } });

    // Populate the tasks in each phase
    const phasesWithTasks = phases.map(phase => ({
      ...phase.toObject(),
      tasks: tasks.filter(task => task.phase.toString() === phase._id.toString()) // Filter tasks for the current phase
    }));

    // Return the product report data (product + phases + tasks)
    res.json({ product, phases: phasesWithTasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product report' });
  }
};

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

exports.updateProduct = async (req, res) => {
  const { id, status } = req.body;
  try {
    let updatedFields = {};
    updatedFields.status = status;
    console.log("Update Product", id, status);
    const updated = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    console.log("updateProduct", err);
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
