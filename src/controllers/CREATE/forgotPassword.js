const express = require('express');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const forgotPasswordValidation = require('../../validation/CREATE/forgot-password-validation');
const sendEmail = require('../../utils/sendEmail');

const forgotPasswordRouter = express.Router();

forgotPasswordRouter.post('/forgotPassword', forgotPasswordValidation, (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(401).json({
            status: 'error',
            error: errors.array()
        });
        return;
    }
    const email = req.body.email;

    // sign a token
    jwt.sign({ expiresIn: '15min'}, process.env.FORGOT_PASSWORD_TOKEN, { expiresIn: '15m'}, (err, token) => {
        if(err){
            res.status(500).json({
                status: 'error',
                error: 'An error occurred, please contact admin'
            })
            return;
        }

        // send password reset link to email

        const emailData = {
            from: process.env.HOST_EMAIL,
            to: email,
            subject: "Password Reset",
            htmlTemplate: `
            <div>
                <div style="margin: 0 6px;">
                    <h1 style="color:blue; font-weight: bold;"> Please click the link below to reset your password</h1>
                    <P> Please <a href=${process.env.PASSWORD_RESET_URL + token} style="color:red; text-decoration: none;">Click HERE</a> to reset your password.</P>
                    <p>Regards</p>
                    <p>ELearning Team.</p>
                </div>
            </div>
            `
        }

        sendEmail(emailData)
        .then(() => {
            res.status(200).json({
                status: 'success',
                data: 'email sent successfully'
            });
            return;
        })
        .catch(e => {
            res.status(500).json({
                status: 'error',
                data: 'email not sent'
            });
            return;
        })

    });

});

module.exports = forgotPasswordRouter;