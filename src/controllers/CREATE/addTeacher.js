const addTeacherRouter = require('express').Router();
const db = require('../../config/db');
const { verifyToken } = require('../../auth/middleware');
const addTeacherValidation = require('../../validation/CREATE/add-teacher-validation');
const { validationResult } = require('express-validator');
const logError = require('../../utils/logErrors');
addTeacherRouter.post('/addTeacher', addTeacherValidation, verifyToken, (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }

    const {
        fullName, description
    } = req.body;

    if(res.payload.isAdmin === 1 || res.payload.isSubAdmin === 1){
        const insertQuery = `INSERT INTO teachers(full_name, description) VALUES('${fullName}', '${description}')`;

        db.query(insertQuery, (err, result) => {
            if(err){
                logError(err);
                return res.status(400).json({
                    status: 'error',
                    msg: 'insert error'
                });
            }

            if(result.affectedRows > 0){
                return res.status(200).json({
                    status: 'success',
                    data: 'insert succesfull'
                });
            }else{
                return res.status(500).json({
                    status: 'error',
                    msg: 'insert error'
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
module.exports = addTeacherRouter;