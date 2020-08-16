const { check } = require('express-validator');

module.exports =  [
    check('userId').isString()
]