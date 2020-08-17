const updateTeacherRouter = require('express').Router();
const db = require('../../config/db');
const { verifyToken } = require('../../auth/middleware');
const { validationResult } = require('express-validator');
const logError = require('../../utils/logErrors');
const { check } = require('express-validator');

const updateTeacherValidation =  [
    check('fullName').isString(),
    check('fullName').isLength({ max: 20 }).withMessage('full name must be less then 20 characters'),
    check('description').isString(),
    check('teacherId').isInt()
]
updateTeacherRouter.put('/teacher', updateTeacherValidation, verifyToken, (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }

    const {
        fullName, description, teacherId
    } = req.body;

    if(res.payload.isAdmin === 1 || res.payload.isSubAdmin === 1){
        const insertQuery = `UPDATE teachers SET full_name='${fullName}', description='${description}' WHERE teacher_id='${teacherId}'`;

        db.query(insertQuery, (err, result) => {
            if(err){
                logError(err);
                return res.status(400).json({
                    status: 'error',
                    msg: 'update error, not all values are provided'
                });
            }

            if(result.affectedRows > 0){
                return res.status(200).json({
                    status: 'success',
                    data: 'update succesfull'
                });
            }else{
                return res.status(500).json({
                    status: 'error',
                    msg: 'update error'
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
module.exports = updateTeacherRouter;