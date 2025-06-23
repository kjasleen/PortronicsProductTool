import express from 'express';
import Order from '../models/Order.js';
import { cookieAuthMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get orders
router.get('/', cookieAuthMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'supplier') {
      const orders = await Order.find({ supplier: req.user.id }).populate('supplier', 'username');
      return res.json(orders);
    } else if (req.user.role === 'company' || req.user.role === 'admin') {
      const orders = await Order.find().populate('supplier', 'username');
      return res.json(orders);
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Create new order
router.post('/create', cookieAuthMiddleware, async (req, res) => {
  try {
    console.log('Decoded JWT user:', req.user);
    const supplierId = req.user.id;
    const newOrder = new Order({
      ...req.body,
      supplier: supplierId  // 🔥 Now set from the authenticated user
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Update an order
router.put('/:id', cookieAuthMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.user.role !== 'supplier' || order.supplier.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this order' });
    }

    const {
      productionStarted,
      shipped,
      productionStartedDate,
      productionCompletionDate,
      shippingDate,
      shippingMode,
      landingPort,
      estimatedLandingDate
    } = req.body;

    order.productionStarted = productionStarted;
    order.shipped = shipped;
    order.productionStartedDate = productionStartedDate;
    order.productionCompletionDate = productionCompletionDate;
    order.shippingDate = shippingDate;
    order.shippingMode = shippingMode;
    order.landingPort = landingPort;
    order.estimatedLandingDate = estimatedLandingDate;

    await order.save();
    res.json({ message: 'Order updated', order });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: 'Failed to update order' });
  }
});

// Delete an order
router.delete('/:id', cookieAuthMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.user.role !== 'supplier' || order.supplier.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this order' });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ message: 'Failed to delete order' });
  }
});

export default router;
