import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
import { requireAdmin, authMiddleware } from '../middleware/authMiddleware.js';


dotenv.config();
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    console.log("Login Api 0 ");
    const { username, password } = req.body;
    console.log("Login Api, ", username);

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'User Not Found !' });

    console.log("Pass", password);
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // ✅ Add role to response
    res.json({
      id:user._id,
      token,
      role: user.role,
    });
  } catch (e) {
    console.error("Error while login", e);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /api/auth/register
router.post('/register', authMiddleware, requireAdmin, async (req, res) => {
  try {
    console.log("In Register");
    const { name, password, email, role } = req.body;
    console.log("In Register 1 user ", name);
    console.log("In Register 1 pass", password);
    console.log("In Register 1 role", role);
        
    if (!name || !password || !role) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }

    /*if(role == "supplier")
    {
      if(!supplierName)
      {
        console.log("Supplier name is required as role is supplier");
        return res.status(400).json({ message: 'Supplier name is required' });
      }
    }*/

     console.log("In Register 2");
    const existingUser = await User.findOne({ name });
    if (existingUser) return res.status(409).json({ message: 'User already exists' });

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    let username = name;
    const newUser = new User({
      username,
      email,
      passwordHash,
      role: role || 'user',
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully', userId: newUser._id });
  } catch (e) {
    console.error("Error during user registration:", e);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



export default router;
