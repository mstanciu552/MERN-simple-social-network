const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    // const token = req.header('auth-token');
    if (!bearerHeader) return res.status(401).send('Access Denied');

    try {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if(err) console.error(err);
            else req.user = user;
        });
        req.token = token;
        next();
    } catch(err) {
        res.status(400).send('Invalid token');
    }
}
