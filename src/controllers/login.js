const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const db = require('../config/db');
const logError = require('../utils/logErrors');
const loginRouter = express.Router();

const loginValidation = require('../validation/login-validation');

loginRouter.post('/', loginValidation, (req, res) => {
    // grap user datails
    const {
        email, password
    } = req.body

    // validate inputs
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(401).json({
            status: 'error',
            msg: errors.array()
        });
        return;
    }

    // check if email and password are valid
    const dbQuery = `SELECT user_id, email, password, first_name, last_name, is_admin FROM users WHERE email='${email}'`;
    db.query(dbQuery, (dbErr, result) => {
        if(dbErr){
            logError(dbErr);
            res.status(501).json({
                status: 'error',
                msg: dbErr.message
            });
            return;
        }

        // if users with given email is not found respond approprately
        if(result.length ===  0){
            res.status(401).json({
                status: 'error',
                msg: 'incorrect email or password'
            });
            return;
        }

        // check if user password is correct
        const hashedPasswordFromDb = result[0].password;
        bcrypt.compare(password, hashedPasswordFromDb, (passwordErr, valid) => {
            if(passwordErr){
                logError(passwordErr);
                res.status(500).json({
                    status: 'error',
                    msg: 'incorrect email or password'
                });
                return;
            }
            if(valid){

                const payload = {
                    userId: result[0].user_id,
                    isAdmin: result[0].is_admin,
                    isSubAdmin: result[0].is_sub_admin
                };

                jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '5h' }, (err, tokenValue) => {
                    if(err){
                        logError(err);
                        res.status(501).json({
                            status: 'error',
                            msg: 'An error occurred please contact admin'
                        });
                        return;
                    }

                    // send response
                    res.cookie('token', tokenValue);
                    res.status(200).json({
                        status: 'success',
                        data: {
                            userId: result[0].user_id,
                            firstName: result[0].first_name,
                            lastName: result[0].last_name,
                            email: result[0].email,
                            token: tokenValue
                        }
                    });
                    return;
                });
                return;
            }

            // for invalid password
            res.status(501).json({
                status: 'error',
                msg: 'incorrect email or password'
            });
            return;
        });


    });

});

module.exports = loginRouter;