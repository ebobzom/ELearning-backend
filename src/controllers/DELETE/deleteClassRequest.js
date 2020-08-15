const deleteclassRequestRouter = require('express').Router();
const db = require('../../config/db');
const { verifyToken } = require('../../auth/middleware');
const deleteClassRequestValidation = require('../../validation/DELETE/class-request-validation');
const { validationResult } = require('express-validator');
const logError = require('../../utils/logErrors');

deleteclassRequestRouter.delete('/request/:requestId', deleteClassRequestValidation, verifyToken, (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }

    const {
        requestId
    } = req.params;

    if(res.payload.isAdmin === 1 || res.payload.isSubAdmin === 1){
        const deleteQuery = `DELETE FROM class_request WHERE request_id='${requestId}'`;

        db.query(deleteQuery, (err, result) => {
            if(err){
                logError(err);
                return res.status(400).json({
                    status: 'error',
                    msg: 'delete error, not all values are provided'
                });
            }

            if(result.affectedRows > 0){
                return res.status(200).json({
                    status: 'success',
                    data: 'request deleted succesfully'
                });
            }else{
                return res.status(500).json({
                    status: 'error',
                    msg: 'delete error, params needed/request id not found'
                });
            }
        });
    }else{
        return res.status(400).json({
            status: 'error',
            msg: 'your are not an admin or paid user'
        });
    }

});
module.exports = deleteclassRequestRouter;