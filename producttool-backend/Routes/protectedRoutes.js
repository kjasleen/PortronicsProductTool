const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');
const allowRoles = require('../Middleware/roleMiddleware');

router.get('/admin-only', authMiddleware, allowRoles(['Admin']), (req, res) => {
  res.json({ message: 'Welcome Admin! You have access to this route.' });
});

module.exports = router;
