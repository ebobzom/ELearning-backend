const { check } = require('express-validator');

module.exports = [
    check('reviewId', 'parameter must be an integer').exists().toInt().isInt()
]