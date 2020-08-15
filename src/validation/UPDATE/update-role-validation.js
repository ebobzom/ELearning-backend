const { check } = require('express-validator');

module.exports =  [
    check('email').isEmail(),
    check('isAdmin').isInt(),
    check('isSubAdmin').isInt()
]
