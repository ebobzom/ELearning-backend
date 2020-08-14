const deleteTeacherRouter = require('express').Router();
const db = require('../../config/db');
const { verifyToken } = require('../../auth/middleware');
const deleteTeacherValidation = require('../../validation/DELETE/delete-teacher-validation');
const { validationResult } = require('express-validator');
const logError = require('../../utils/logErrors');

deleteTeacherRouter.delete('/teacher/:teacherId', deleteTeacherValidation, verifyToken, (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }

    const {
        teacherId
    } = req.params;

    if(res.payload.isAdmin === 1 || res.payload.isSubAdmin === 1){
        const deleteQuery = `DELETE FROM teachers WHERE teacher_id='${teacherId}'`;

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
                    data: 'deleted succesfully'
                });
            }else{
                return res.status(500).json({
                    status: 'error',
                    msg: 'delete error, params needed'
                });
            }
        });
    }else{
        return res.status(400).json({
            status: 'error',
            msg: 'your are not an admin'
        });
    }

});
module.exports = deleteTeacherRouter;