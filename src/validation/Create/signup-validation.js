const { check } = require('express-validator');

module.exports =  [
    check('firstName').isString(),
    check('firstName').isLength({ max: 20 }).withMessage('first name must be less then 20 characters'),
    check('lastName').isString(),
    check('lastName').isLength({ max: 20 }).withMessage('last name must be less then 20 characters'),
    check('email').isEmail().withMessage('invalid email format'),
    check('password').isLength({ min: 5 }).withMessage('password must be more than 5 characters')
]