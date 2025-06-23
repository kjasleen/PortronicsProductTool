import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/products?category=&superCategory=&search=
router.get('/', async (req, res) => {
  const { category, superCategory, search } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (superCategory) filter.superCategory = superCategory;
  if (search) {
    filter.$or = [
      { productName: new RegExp(search, 'i') },
      { sku: new RegExp(search, 'i') }
    ];
  }

  try {
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.log("Error in fetching product", err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

export default router;
