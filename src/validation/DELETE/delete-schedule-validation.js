const { check } = require('express-validator');

module.exports = [
    check('scheduleId', 'parameter must be an integer').exists().toInt().isInt()
]