const jwt = require('jsonwebtoken');

exports.verifyToken = function(req, res, next){
    const token = req.body.token || req.cookies.token;

    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if(err){
            res
            .status(400)
            .json({
                status: 'error',
                error: 'authentication failed'
            });
            return;

        }

        if(payload){
            res.payload = payload;
            next();
        }
    });
}


exports.verifyTokenForFetchingCourses = function(req, res, next){
    const token = req.body.token || req.cookies.token;

    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if(err){
            res.registeredUser = false;
            next();
        }
        res.registeredUser = true;
        if(payload){
            res.payload = payload;
            next();
        }
    });
}
