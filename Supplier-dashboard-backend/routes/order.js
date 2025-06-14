// routes/order.js
import express from 'express';
import Order from '../models/Order.js';
const router = express.Router();

// Create new order
router.post('/create', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({}, 'name'); // assuming a Product model with a 'name' field
    res.json(products.map(p => p.name));
  } catch (err) {
    console.error('Failed to fetch products', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
