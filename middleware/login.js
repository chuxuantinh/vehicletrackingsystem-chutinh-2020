const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    const loginToken = req.cookies.xAuthToken;
    if(loginToken){
        const decoded = jwt.verify(loginToken, 'vehicle');
        req.login = decoded;
        return res.redirect('/dashboard/agency/'+decoded._id);
    }
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
}