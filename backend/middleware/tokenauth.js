const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();

const verifytoken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Authentication failed' });
  }

  const token = authHeader.split(' ')[1];
  

  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded; // Corrected from res.user
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
    console.log(error)
  }
};

module.exports = verifytoken;
