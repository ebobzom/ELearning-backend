const { check } = require('express-validator');

module.exports = [
    check('courseId', 'parameter must be an integer').exists().toInt().isInt()
]