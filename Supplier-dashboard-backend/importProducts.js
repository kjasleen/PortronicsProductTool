import xlsx from 'xlsx';
import mongoose from 'mongoose';
import SuperCategory from './models/SuperCategory.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

const MONGO_URI = 'mongodb+srv://Jasleen:ReszZGczqA8azked@clusterportronics.lkwzdsy.mongodb.net/Portronics-Suppliers-Management'; // <-- change your DB name

await mongoose.connect(MONGO_URI);
console.log("✅ Connected to MongoDB");

// Step 1: Read Excel file
const workbook = xlsx.readFile('ProductList.xlsx'); // <-- change your file path
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet);

console.log(`✅ Loaded ${rows.length} rows from Excel`);

const superCategoryMap = {};
const categoryMap = {};

// Step 2: Process Super Categories
const uniqueSuperCategories = [...new Set(rows.map(r => r['Super Category']))];

for (const scName of uniqueSuperCategories) {
  let sc = await SuperCategory.findOne({ name: scName });
  if (!sc) {
    sc = await SuperCategory.create({ name: scName });
    console.log(`Added Super Category: ${scName}`);
  }
  superCategoryMap[scName] = sc._id;
}

// Step 3: Process Categories
for (const row of rows) {
  const scName = row['Super Category'];
  const cName = row['Category'];
  const superCategoryId = superCategoryMap[scName];

  const key = `${cName}|${scName}`;
  if (!categoryMap[key]) {
    let cat = await Category.findOne({ name: cName, superCategoryId });
    if (!cat) {
      cat = await Category.create({ name: cName, superCategoryId });
      console.log(`Added Category: ${cName} under ${scName}`);
    }
    categoryMap[key] = cat._id;
  }
}

// Step 4: Prepare products
const productDocs = [];

for (const row of rows) {
  const scName = row['Super Category'];
  const cName = row['Category'];
  const sku = row['SKU'];
  const productName = row['Product Name'];
  const categoryId = categoryMap[`${cName}|${scName}`];

  // Avoid duplicates by SKU
  const existing = await Product.findOne({ sku });
  if (!existing) {
    productDocs.push({
      sku,
      productName,
      categoryId,
    });
  }
}

// Step 5: Insert products
if (productDocs.length > 0) {
  await Product.insertMany(productDocs);
  console.log(`✅ Inserted ${productDocs.length} products`);
} else {
  console.log(`⚠️ No new products to insert (all SKUs already exist)`);
}

console.log("🎉 All done! 🚀");
process.exit();
