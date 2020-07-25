const jwt = require('jsonwebtoken');

function verifyToken(req, res, next){
    const token = req.body.token || req.cookies.token;

    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if(err){
            res
            .status(400)
            .json({
                status: 'success',
                error: 'authentication failed'
            });
            return;

        }

        if(payload){
            req.payload = payload;
            next();
        }
    });
}

module.export = {
    verifyToken
}