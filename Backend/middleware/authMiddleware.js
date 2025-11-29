const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (roles = []) => {
  return (req, res, next) => {
    const header = req.header('Authorization');
    if (!header) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = header.replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = auth;
