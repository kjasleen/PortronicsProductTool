const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Config/db');


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./Routes/authRoutes'));

app.get('/', (req, res) => res.send('API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use('/api/protected', require('./Routes/protectedRoutes'));
app.use('/api/products', require('./Routes/productRoutes'));
app.use('/api/phases', require('./Routes/phaseRoutes'));
