module.exports = function(req, res, next){
    if(!req.login.isAdmin) return res.status(401).send('Access Denied You Are not Admin');
    next();
}