const { check } = require('express-validator');

module.exports = [
    check('teacherId', 'parameter must be an integer').exists().toInt().isInt()
]