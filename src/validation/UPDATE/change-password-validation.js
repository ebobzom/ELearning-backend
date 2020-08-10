const { check } = require('express-validator');

module.exports =  [
    check('password').isString(),
    check('password').isLength({ max: 20 }).withMessage('password must be less then 20 characters'),
    check('confirmPassword').isString(),
    check('confirmPassword').isLength({ max: 20 }).withMessage('confirm password must be less then 20 characters'),
    check('oldPassword').isString(),
    check('oldPassword').isLength({ max: 20 }).withMessage('old password must be less then 20 characters')
]