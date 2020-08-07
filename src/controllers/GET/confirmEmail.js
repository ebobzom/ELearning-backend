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
            // TODO: redirect to error page, with message click link again
            return res.redirect('https://google.com');
        }
        if(result.affectedRows > 0){
            res.redirect('https://google.com'); //resdirect to login page ( add a params that front end can use to determine if confirmed so a message is shown)
            return;
        }

        // TODO: redirect to error page, with message click link again
        return res.redirect('https://google.com');
     });
    
});

module.exports = confirmEmailController;