const resendEmailConfirmation = require('express').Router();
const { verifyToken } = require('../../auth/middleware');
const { validationResult } = require('express-validator');
const resendEmailConfirmationValidation = require('./../../validation/CREATE/resedEmail');
const db = require('../../config/db');
const logError = require('../../utils/logErrors');

resendEmailConfirmation.post('/emailConfirmation',resendEmailConfirmationValidation, verifyToken, (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }

    const { userId } = req.body;

    // get user email
    const query = `SELECT email, first_name from users WHERE user_id='${userId}'`;
    db.query(query, (err, result) =>{
        if(err){
            logError(err);
            res.status(500).json({
                status: 'error',
                msg: 'An error occurred, please contact admin'
            });
            
            return;
        }
        if(result[0].email){
            // send email
            let confirmationUrl = process.env.EMAIL_COMFIRMATION_URL + userId;
            const emailData = {
                from: process.env.HOST_EMAIL,
                to: result[0].email,
                subject: "Welcome to ELearning",
                htmlTemplate: `
                <div>
                    <div style="margin: 0 6px;">
                        <h1 style="color:blue; font-weight: bold;"> Welcome ${result[0].first_name}</h1>
                        <P> Please <a href=${confirmationUrl} style="color:red; text-decoration: none;">Click HERE</a> to comfirm your account.</P>
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
                    data: 'confirmation email sent'
                });
            })
            .catch((e) => {
                logError(e);
                res.status(400).json({
                status: 'error',
                data: 'confirmation email not sent'
                });
            });

        }else{
            logError(dbErr);
            return res.status(400).json({
                status: 'error',
                msg: 'Incorrect credentials'
            });
        }
    });

});


module.exports = resendEmailConfirmation;