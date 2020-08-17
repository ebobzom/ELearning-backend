const addTeacherRouter = require('express').Router();
const db = require('../../config/db');
const { verifyToken } = require('../../auth/middleware');
const { validationResult } = require('express-validator');
const logError = require('../../utils/logErrors');
const { check } = require('express-validator');

let addTeacherValidation = [
    check('fullName').isString(),
    check('fullName').isLength({ max: 20 }).withMessage('full name must be less then 20 characters'),
    check('description').isString()
]
let = addTeacherRouter.post('/teacher', addTeacherValidation, verifyToken, (req, res) => {
    
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
                    data: {
                        fullName, description, teacherId: result.insertId
                    }
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