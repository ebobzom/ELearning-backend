const express = require('express');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const sendEmail = require('../../utils/sendEmail');
const logError = require('../../utils/logErrors');
const { check } = require('express-validator');

const forgotPasswordValidation = [
    check('email').isEmail().withMessage('email is required')
];

const forgotPasswordRouter = express.Router();

forgotPasswordRouter.post('/forgotPassword', forgotPasswordValidation, (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(401).json({
            status: 'error',
            msg: errors.array()
        });
        return;
    }
    const email = req.body.email;

    // sign a token
    jwt.sign({ email: email }, process.env.FORGOT_PASSWORD_TOKEN, { expiresIn: '15m'}, (err, token) => {
        if(err){
            logError(err);
            res.status(500).json({
                status: 'error',
                msg: 'An error occurred, please contact admin'
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
            logError(e);
            res.status(500).json({
                status: 'error',
                data: 'email not sent'
            });
            return;
        })

    });

});

module.exports = forgotPasswordRouter;