const User = require('../Models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../Utils/logger'); // Import the logger


exports.register = async (req, res) => {
  console.log("Incoming request to /register");
  console.log("req.body:", req.body);

  const { username, password, role } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) 
    {
      logger.warn(`⚠️ User registration failed: ${username} already exists.`);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, password: hashedPassword, role });
    logger.info(`✅ New user registered: ${username} with role: ${role}`);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    logger.error(`❌Error registering user: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
