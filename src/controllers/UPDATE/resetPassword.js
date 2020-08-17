const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const db = require('../../config/db');
const logError = require('../../utils/logErrors');

const resetPasswordRouter = express.Router();
const { check } = require('express-validator');

const resetPasswordValidation = [
    check('token').isJWT().withMessage('token must be jwt'),
    check('password').isLength({ min: 5 }).withMessage('password must be more than 5 and less than 16 characters'),
    check('confirmPassword').isLength({ min: 5 }).withMessage('confirm password must be more than 5 and less than 16 characters')
];

resetPasswordRouter.post('/resetPassword', resetPasswordValidation, (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(401).json({
            status: 'error',
            msg: errors.array()
        });
        return;
    }

    const { password, confirmPassword, token } = req.body;

    jwt.verify(token, process.env.FORGOT_PASSWORD_TOKEN, (err, payload) => {
        if(err){
            logError(err);
            res.status(500).json({
                status: 'error',
                msg: 'link expired or invalid, please go to forgot password page to generate a new link'
            });
            return;
        }

        if(password === confirmPassword){

            bcrypt.hash(password, 10, (err, hash) => {
                if(err){
                    logError(err);
                    res.status(500).json({
                        status: 'error',
                        msg: 'please try again later'
                    });
                    return;
                }
                 // update password
                const updatePasswordQuery = `UPDATE users SET password='${hash}' WHERE email='${payload.email}'`

                db.query(updatePasswordQuery, (err, result) => {

                    if(err){
                        logError(err);
                        res.status(500).json({
                            status: 'error',
                            msg: 'an error occured, please try again later'
                        });
                        return;
                    }else if(result.affectedRows > 0){
                        res.status(200).json({
                            status: 'success',
                            msg: 'password updated successfully'
                        });
                        return;
                    } else{

                        res.status(400).json({
                            status: 'error',
                            msg: 'user does not exist'
                        });
                        return;
                    }

                });
                
            });
            
        }else{
            res.status(401).json({
                status: 'error',
                msg: 'passwords do not match'
            });
            return;
        }
    });

});

module.exports = resetPasswordRouter;
