const express = require('express');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const sendEmail = require('../../utils/sendEmail');
const db = require('../../config/db');
const logError = require('../../utils/logErrors');

const signuRouter = express.Router();

const signupValidation = require('../../validation/CREATE/signup-validation');

signuRouter.post('/', signupValidation, (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(401).json({
            status: 'error',
            msg: errors.array()
        });
        return;
    }

    // coverting variable to match db variable casing
    const {
        firstName: first_name,
        lastName: last_name,
        email,
        password,
        confirmPassword
    } = req.body;

    if(password != confirmPassword){
        res.status(400).json({
            status: 'error',
            msg: 'password does not match'
        });
        return;
    }

    const dataSentToDb = {
        first_name,
        last_name,
        password,
        email
    };

    // check if user exists
    const checkUser = `SELECT email FROM users WHERE email='${dataSentToDb.email}'`
    db.query(checkUser,(queryErr, result) =>{
        if(queryErr){
            logError(queryErr);
            res.status(500).json({
                status: 'error',
                msg: 'An error occurred, please contact admin'
            });
            return;
        }

        if(result.length > 0){
            res.status(401).json({
                status: 'error',
                msg: 'user already exists please login'
            });
            return;
        }

        // hash password
        bcrypt.hash(dataSentToDb.password, 10, (err, hash) => {
            if(err){
                logError(err);
                return res.status(500).json({
                    status: 'error',
                    msg: 'An error occurred, please contact admin'
                });
            }  

            // modify user password and assign primary key
            dataSentToDb.password = hash;
            const userUUID = uuid.v1().split('-').join('');
            dataSentToDb.user_id = userUUID;

            // create user in db

            const queryString = 'INSERT INTO users SET ?'
            db.query(queryString, dataSentToDb, (dbErr) => {

                if(dbErr){
                    logError(dbErr);
                    res.status(500).json({
                        status: 'error',
                        msg: 'An error occurred, please contact admin'
                    });
                    
                    return;
                }

                // send email
                confirmationUrl = process.env.EMAIL_COMFIRMATION_URL + userUUID;
                const emailData = {
                    from: process.env.HOST_EMAIL,
                    to: dataSentToDb.email,
                    subject: "Welcome to ELearning",
                    htmlTemplate: `
                    <div>
                        <div style="margin: 0 6px;">
                            <h1 style="color:blue; font-weight: bold;"> Welcome ${dataSentToDb.first_name}</h1>
                            <P> Please <a href=${confirmationUrl} style="color:red; text-decoration: none;">Click HERE</a> to comfirm your account.</P>
                            <p>Regards</p>
                            <p>ELearning Team.</p>
                        </div>
                    </div>
                    `
                }

                const returnedData = {
                    userId: userUUID,
                    firstName: dataSentToDb.first_name,
                    last_name: dataSentToDb.last_name,
                    email: dataSentToDb.email
                };

                sendEmail(emailData)
                .then(() => {
                    returnedData.emailConfirmationStatus= 'success';
                    res.status(201).json({
                        status: 'success',
                        data: returnedData
                    });
                })
                .catch((e) => {
                    logError(e);
                    returnedData.emailConfirmationStatus= 'error';
                    res.status(201).json({
                    status: 'success',
                    data: returnedData
                    });
                });
                
                return;
            });
            return;
        });
    });

})

module.exports = signuRouter;