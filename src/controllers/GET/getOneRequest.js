const getOneRequestRouter = require('express').Router();
const db = require('../../config/db');
const { validationResult } = require('express-validator');
const getOneScheduleValidation = require('../../validation/GET/get-one-schedule-validation');
const logError = require('../../utils/logErrors');

getOneRequestRouter.get('/requests/:email', getOneScheduleValidation, (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }

    const { email } = req.params
 
    let query = `SELECT request_id, subject, topic, request_date, email, student_class FROM class_request WHERE email='${email}'`;
    
    db.query(query, (err, result) => {
        if(err){
            logError(err);
            return res.status(400).json({
                status: 'error',
                msg: 'an error occured, cross check your parameters'
            });
        }

    
        return res.status(200).json({
            status: 'success',
            data: result
        });
    });

});
module.exports = getOneRequestRouter;