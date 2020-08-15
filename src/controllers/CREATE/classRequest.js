const classRequestRouter = require('express').Router();
const db = require('../../config/db');
const { verifyToken } = require('../../auth/middleware');
const classRequestValidation = require('../../validation/CREATE/class-request-validation');
const { validationResult } = require('express-validator');
const logError = require('../../utils/logErrors');

classRequestRouter.post('/request', classRequestValidation, verifyToken, (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }

    // TODO: add logic to allow only paid to have acces to request a course

    const {
        subject, topic, userId: user_id
    } = req.body;

    const postData = {
        subject, topic, user_id
    };

    if(res.payload.isAdmin === 1 || res.payload.isSubAdmin === 1){
        const insertQuery = `INSERT INTO class_request SET ?`;

        db.query(insertQuery, postData, (err, result) => {
            if(err){
                logError(err);
                return res.status(400).json({
                    status: 'error',
                    msg: 'class request error, cross check your parameters'
                });
            }

            if(result.affectedRows > 0){
                return res.status(200).json({
                    status: 'success',
                    data: 'class request made succesfully'
                });
            }else{
                return res.status(500).json({
                    status: 'error',
                    msg: 'class request error'
                });
            }
        });
    }else{
        return res.status(400).json({
            status: 'error',
            msg: 'your are not an admin or a paid user'
        });
    }

});
module.exports = classRequestRouter;