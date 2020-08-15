const { check } = require('express-validator');

module.exports = [
    check('requestId', 'parameter must be an integer').exists().toInt().isInt()
]