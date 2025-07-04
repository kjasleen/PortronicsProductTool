import express from 'express';
import Product from '../models/Product.js';
import SuperCategory from '../models/SuperCategory.js'
import Category from '../models/Category.js';


const router = express.Router();

/*
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
});*/

// Create Super Category
router.post('/super-categories', async (req, res) => {
  const { name } = req.body;
  const exists = await SuperCategory.findOne({ name });
  if (exists) return res.status(400).json({ message: 'Super Category already exists' });

  const superCategory = await SuperCategory.create({ name });
  res.status(201).json(superCategory);
});

//Get Super Category
router.get('/super-categories', async (req, res) => {
  const list = await SuperCategory.find().sort({ name: 1 });
  res.json(list);
});

// Create Category
router.post('/categories', async (req, res) => {
  const { name, superCategoryId } = req.body;
  const exists = await Category.findOne({ name, superCategoryId });
  if (exists) return res.status(400).json({ message: 'Category already exists in this Super Category' });

  const category = await Category.create({ name, superCategoryId });
  res.status(201).json(category);
});

//Get Category
router.get('/categories', async (req, res) => {
  const { superCategoryId } = req.query;
  const filter = {};
  if (superCategoryId) filter.superCategoryId = superCategoryId;

  const categories = await Category.find(filter).sort({ name: 1 });
  res.json(categories);
});

// Create Product
router.post('/products', async (req, res) => {
  const { sku, productName, categoryId } = req.body;
  const exists = await Product.findOne({ sku });
  if (exists) return res.status(400).json({ message: 'Product with this SKU already exists' });

  const product = await Product.create({ sku, productName, categoryId });
  res.status(201).json(product);
});


//Get Products
router.get('/products', async (req, res) => {
  const { categoryId, search } = req.query;

  const filter = {};
  if (categoryId) filter.categoryId = categoryId;
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ productName: regex }, { sku: regex }];
  }

  const products = await Product.find(filter)
    .populate({
      path: 'categoryId',
      populate: { path: 'superCategoryId' }
    })
    .sort({ productName: 1 });

  res.json(products);
});


//Hierarchy
router.get('/hierarchy', async (req, res) => {
  try {
    const superCategories = await SuperCategory.find().sort({ name: 1 });

    const result = await Promise.all(
      superCategories.map(async (superCat) => {
        const categories = await Category.find({ superCategoryId: superCat._id }).sort({ name: 1 });

        const categoriesWithProducts = await Promise.all(
          categories.map(async (cat) => {
            const products = await Product.find({ categoryId: cat._id }).sort({ productName: 1 });

            return {
              category: cat.name,
              categoryId: cat._id,
              products: products.map(prod => ({
                productName: prod.productName,
                sku: prod.sku,
                productId: prod._id
              }))
            };
          })
        );

        return {
          superCategory: superCat.name,
          superCategoryId: superCat._id,
          categories: categoriesWithProducts
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("Failed to build hierarchy", err);
    res.status(500).json({ message: 'Error fetching product hierarchy' });
  }
});



export default router;
