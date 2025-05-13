const jwt = require('jsonwebtoken');

// Authentication middleware to verify the token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];  // Ensure this is in the correct format: "Bearer <token>"
  if (!token) 
  {
    console.log("Token Missing, Unauthorized");
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Check that the JWT_SECRET is set in .env
    req.user = decoded;
    console.log("BEfore next()");
    next();  // Proceed to the next middleware or route handler
    console.log("Afternext()");
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: 'Expired token' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Authorization middleware to check user role
const allowRoles = (roles) => (req, res, next) => {
  console.log("in allowRoles");

  if (!roles.includes(req.user.role)) {  // Check if the user's role is in the allowed roles
    return res.status(403).json({ message: 'Forbidden' });
  }
  console.log("Bef next");
  next();  // Proceed to the next middleware or route handler
  console.log("Afer next");
};

module.exports = { authMiddleware, allowRoles };
