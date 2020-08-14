const { check } = require('express-validator');

module.exports =  [
    check('courseTitle').isString(),
    check('subject').isString().isLength({ max: 25 }).withMessage('subject must be less then 26 characters'),
    check('description').isString(),
    check('courseUrl').isString(),
    check('courseDuration').isString(),
    check('courseOwnerId').isString(),
    check('teacherId').isInt(),
    check('courseId').isInt()
]
