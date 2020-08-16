const { check } = require('express-validator');

module.exports =  [
    check('courseTitle').isString(),
    check('description').isString(),
    check('scheduleDate').isString(),
    check('courseOwnerEmail').isEmail(),
    check('startTime').isString(),
    check('teacherId').isInt(),
    check('scheduleId').isInt()
]
