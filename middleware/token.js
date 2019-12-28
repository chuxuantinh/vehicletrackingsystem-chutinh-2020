const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.cookies.xAuthToken;
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, 'vehicle');
    req.agency = decoded; 
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
}