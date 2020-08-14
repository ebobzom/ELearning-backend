const { check } = require('express-validator');

module.exports =  [
    check('fullName').isString(),
    check('fullName').isLength({ max: 20 }).withMessage('full name must be less then 20 characters'),
    check('description').isString()
]