const { check } = require('express-validator');

module.exports = [
    check('email').isEmail().withMessage('invalid email'),
    check('password').isLength({ min: 5, max: 15 }).withMessage('password must be more than 5 and less than 16 characters'),
]