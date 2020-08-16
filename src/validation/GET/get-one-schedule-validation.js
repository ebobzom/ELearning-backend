const { check } = require('express-validator');

module.exports = [
    check('email', 'parameter must be an integer').exists().isEmail()
]