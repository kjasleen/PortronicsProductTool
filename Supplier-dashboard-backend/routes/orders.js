import express from 'express';
import Order from '../models/Order.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  if (req.user.role === 'supplier') {
    const orders = await Order.find({ supplier: req.user.id });
    return res.json(orders);
  } else if (req.user.role === 'company') {
    const orders = await Order.find().populate('supplier', 'supplierName');
    return res.json(orders);
  } else {
    return res.status(403).json({ message: 'Unauthorized' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (req.user.role !== 'supplier' || order.supplier.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized to update this order' });
  }

  const {
    productionStarted,
    productionCompleted,
    shippingStarted,
    shipped
  } = req.body;

  order.productionStarted = productionStarted;
  order.productionCompleted = productionCompleted;
  order.shippingStarted = shippingStarted;
  order.shipped = shipped;

  // Derive status from stages
  if (shipped > 0) order.status = 'Shipped';
  else if (shippingStarted > 0) order.status = 'Shipping Started';
  else if (productionCompleted > 0) order.status = 'Production Completed';
  else if (productionStarted > 0) order.status = 'Production Started';
  else order.status = 'Ordered';

  await order.save();
  res.json({ message: 'Order updated', order });
});

export default router;
