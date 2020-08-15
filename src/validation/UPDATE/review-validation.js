const { check } = require('express-validator');

module.exports =  [
    check('comment').isString(),
    check('courseId').isInt(),
    check('reviewId').isInt(),
    check('userId').isString()
]