import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';
import productRoutes from './routes/product.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Global middleware
/*app.use(cors({
  origin: 'FRONTEND_URL', // Change this to your deployed frontend URL
  credentials: true
}));*/
 const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'];
 app.use(cors({
   origin: (origin, callback) => {
     if (!origin || allowedOrigins.includes(origin)) {
       callback(null, true);
     } else {
       callback(new Error('Not allowed by CORS'));
     }
   },
   credentials: true
 }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));



app.use((req, res, next) => {
  // ✅ Request timing logger
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// ✅ Safe sanitization only for req.body and req.params
app.use((req, res, next) => {
  try {
    if (req.body) mongoSanitize.sanitize(req.body);
    if (req.params) mongoSanitize.sanitize(req.params);
  } catch (e) {
    console.warn('Sanitization error:', e);
  }
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
