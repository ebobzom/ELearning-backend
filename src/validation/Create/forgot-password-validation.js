const { check } = require('express-validator');

const forgotPasswordValidation = [
    check('email').isEmail().withMessage('email is required')
];

module.exports = forgotPasswordValidation;