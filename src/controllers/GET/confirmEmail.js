const express = require('express');
const db = require('../../config/db');
const logError = require('./../../utils/logErrors');
const confirmEmailController = express.Router();

confirmEmailController.get('/:userId', (req, res) => {
    const userId = req.params.userId;
     // change email status to true
     const confirmEmailQuery = `UPDATE users SET email_confirmed='${1}' WHERE user_id = '${userId}'`;
     db.query(confirmEmailQuery,(err, result) => {
        if(err){
            logError(err);
            res.status(500).json({
                status: 'error',
                msg: "please click confirm email link again"
            });
            return;
        }
        if(result.affectedRows > 0){
            res.redirect('https://google.com'); //resdirect to login page ( add a params that front end can use to determine if confirmed so a message is shown)
            return;
        }
        res.status(400).json({
            status: 'error',
            msg: "invalid user detail"
        });
        return;
     });
    
});

module.exports = confirmEmailController;