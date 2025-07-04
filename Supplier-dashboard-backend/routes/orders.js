import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import SuperCategory from '../models/SuperCategory.js';
import { cookieAuthMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get orders
router.get('/', cookieAuthMiddleware, async (req, res) => {
  try {
    let orders;

    if (req.user.role === 'supplier') {
      orders = await Order.find({ supplier: req.user.id })
        .populate('supplier', 'username')
        .populate('product', 'productName sku');
    } else if (req.user.role === 'company' || req.user.role === 'admin') {
      orders = await Order.find()
        .populate('supplier', 'username')
        .populate('product', 'productName sku');
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Create new order
router.post('/create', cookieAuthMiddleware, async (req, res) => {
  try {
    const { supplierId, productId, ...rest } = req.body;

    if (!supplierId || !productId) {
      return res.status(400).json({ message: 'Supplier ID and Product ID are required' });
    }

    // Get full product info for snapshot
    const product = await Product.findById(productId).populate({
      path: 'categoryId',
      populate: { path: 'superCategoryId' }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Build product snapshot
    const productSnapshot = {
      productName: product.productName,
      sku: product.sku,
      categoryName: product.categoryId.name,
      superCategoryName: product.categoryId.superCategoryId.name,
    };

    const newOrder = new Order({
      ...rest,
      product: productId,
      productSnapshot,
      supplier: supplierId
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

    // Allow only admin or supplier
    if (req.user.role !== 'admin' && req.user.role !== 'supplier') {
      return res.status(403).json({ message: 'Only admin or supplier can update orders' });
    }

    // If supplier, ensure they own the order
    if (req.user.role === 'supplier' && order.supplier.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: Cannot update orders of other suppliers' });
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

    if (req.user.role !== 'admin' && req.user.role !== 'supplier') {
      return res.status(403).json({ message: 'Only admin or supplier can delete orders' });
    }

    if (req.user.role === 'supplier' && order.supplier.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: Cannot delete orders of other suppliers' });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ message: 'Failed to delete order' });
  }
});

export default router;
