import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';
import productRoutes from './routes/product.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Simple request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ DB error:', err));

app.use('/api', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
