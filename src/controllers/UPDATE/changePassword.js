const bcrypt = require('bcrypt');
const db = require('../../config/db');
const { verifyToken } = require('../../auth/middleware');
const { validationResult } = require('express-validator');
const logError = require('../../utils/logErrors');
const changePassword = require('../../validation/UPDATE/change-password-validation');
const changePasswordRouter = require('express').Router();


changePasswordRouter.post('/changePassword', changePassword, verifyToken, (req, res) => {
    const { password, confirmPassword, oldPassword } = req.body;

    const errors = validationResult(req);

    if(!errors){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }
    // compare user password
    if(password != confirmPassword){
        return res.status(500).json({
            status: 'error',
            msg: "password and confirm password don't match"
        });
    }

    // get old password hash
    const oldPasswordQuery =  `SELECT password FROM users WHERE user_Id='${res.payload.userId}'`;
    db.query(oldPasswordQuery, (err, result) => {
        if(err){
            logError(err);
            return res.status(500).json({
                status: 'error',
                msg: 'An error occured'
            });
        }

        if(result.length > 0){
            bcrypt.compare(oldPassword, result[0].password, (err) => {
                if(err){
                    logError(err);
                    return res.status(500).json({
                        status: 'error',
                        msg: 'Old password not correct'
                    });
                }else{
                    bcrypt.hash(password, 10, (err, hash) => {
                        if(err){
                            logError(err);
                            return res.status(500).json({
                                status: 'error',
                                msg: 'An error occured'
                            });
                        }
                        const newPasswordQuery = `UPDATE users SET password='${hash}' WHERE user_id='${res.payload.userId}'`;
                        db.query(newPasswordQuery, (err, resultVal) => {
                            if(err){
                                logError(err);
                                return res.status(500).json({
                                    status: 'error',
                                    msg: 'An error occured'
                                });
                            }
                            if(resultVal.affectedRows > 0){
                                return res.status(200).json({
                                    status: 'success',
                                    msg: 'password updated successfully'
                                });
                            }

                            return res.status(500).json({
                                status: 'error',
                                msg: 'password not updated'
                            });

                        });
                    });
                }
   
            });
        }else{
            return res.status(400).json({
                status: 'error',
                msg: 'Wrong old password'
            });
        }

        

    });
});

module.exports = changePasswordRouter;
