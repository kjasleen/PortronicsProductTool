import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { requireAdmin, cookieAuthMiddleware } from '../middleware/authMiddleware.js';

dotenv.config();
const router = express.Router();

// GET /api/auth/me
router.get('/me', cookieAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username role');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Failed to fetch user info' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User Not Found !' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

   res.cookie('token', token, {
                              httpOnly: true,
                              secure: process.env.NODE_ENV === 'production',
                              sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                              maxAge: 8 * 60 * 60 * 1000
                            });

    res.status(200).json({ message: 'Login successful', role: user.role });
  } catch (e) {
    console.error("Error while login", e);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  });
  res.status(200).json({ message: 'Logged out' });
});

router.post('/register', cookieAuthMiddleware, requireAdmin, async (req, res) => {
  try {
    const { name, password, email, role } = req.body;
    if (!name || !password || !role) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }

    console.log("NewUser Registration", role);

    const existingUser = await User.findOne({ name });
    if (existingUser) return res.status(409).json({ message: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ username: name, email, passwordHash, role });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', userId: newUser._id });
  } catch (e) {
    console.error("Error during user registration:", e);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No user with that email' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 1000 * 60 * 30; // 30 minutes

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;
    console.log("REset link ", resetLink);

    // Configure your email service
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or SendGrid/Mailgun/etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 30 minutes.</p>`,
    });

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    const passwordHash = await bcrypt.hash(password, 10);
    user.passwordHash = passwordHash;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/users/vendors
router.get('/vendors', cookieAuthMiddleware, async (req, res) => {
  try {
    const vendors = await User.find({ role: 'supplier' }).select('_id username email'); // Adjust 'supplier' if your role uses 'vendor'
    res.json(vendors);
  } catch (err) {
    console.error('Error fetching vendors:', err);
    res.status(500).json({ message: 'Failed to retrieve vendors' });
  }
});


export default router;

