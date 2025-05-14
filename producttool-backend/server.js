const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Config/db');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

connectDB();

app.use('/api/auth', require('./Routes/authRoutes'));
app.get('/', (req, res) => res.send('API running'));
app.use('/api/products', require('./Routes/productRoutes'));
app.use('/api/phases', require('./Routes/phaseRoutes'));
app.use('/api/tasks', require('./Routes/taskRoutes'))


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

