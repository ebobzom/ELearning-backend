const { check } = require('express-validator');

module.exports =  [
    check('topic').isString(),
    check('subject').isString(),
    check('studentClass').isString(),
    check('subject').isLength({ max: 20 }).withMessage('full name must be less then 20 characters'),
    check('userId').isString(),
    check('requestId').isInt()
]