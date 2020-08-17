const updateClassRequestRouter = require('express').Router();
const db = require('../../config/db');
const { verifyToken } = require('../../auth/middleware');
const { validationResult } = require('express-validator');
const logError = require('../../utils/logErrors');
const { check } = require('express-validator');

let updateClassRequestValidation =  [
    check('topic').isString(),
    check('subject').isString(),
    check('studentClass').isString(),
    check('subject').isLength({ max: 20 }).withMessage('full name must be less then 20 characters'),
    check('userId').isString(),
    check('requestId').isInt()
]

updateClassRequestRouter.put('/request', updateClassRequestValidation, verifyToken, (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }

    // TODO: add logic to allow only paid to have acces to request a course

    const {
        subject, topic, userId: user_id, requestId: request_id
    } = req.body;

    const postData = [
        subject, topic, user_id, request_id
    ];
    
    if(res.payload.isAdmin === 1 || res.payload.isSubAdmin === 1){
        const insertQuery = `UPDATE class_request SET subject = ?, topic = ?, user_id = ? WHERE request_id = ?`;

        db.query(insertQuery, postData, (err, result) => {
            if(err){
                logError(err);
                return res.status(400).json({
                    status: 'error',
                    msg: 'class request update error, cross check your parameters'
                });
            }

            if(result.affectedRows > 0){
                return res.status(200).json({
                    status: 'success',
                    data: 'class request update made succesfully'
                });
            }else{
                return res.status(500).json({
                    status: 'error',
                    msg: 'class request update error'
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
module.exports = updateClassRequestRouter;