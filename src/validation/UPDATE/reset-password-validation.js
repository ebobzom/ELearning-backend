const { check } = require('express-validator');

const resetPasswordValidation = [
    check('token').isJWT().withMessage('token must be jwt'),
    check('password').isLength({ min: 5 }).withMessage('password must be more than 5 and less than 16 characters'),
    check('confirmPassword').isLength({ min: 5 }).withMessage('confirm password must be more than 5 and less than 16 characters')
];

module.exports = resetPasswordValidation;