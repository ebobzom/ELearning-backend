const { check } = require('express-validator');

const emailConfirmationValidation = [
    check('userId').isUUID('v1').withMessage('userId must be of type UUUID')
];

module.exports = emailConfirmationValidation;