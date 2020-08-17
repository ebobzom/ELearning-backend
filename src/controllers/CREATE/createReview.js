const classReviewRouter = require('express').Router();
const db = require('../../config/db');
const { verifyToken } = require('../../auth/middleware');
const { validationResult } = require('express-validator');
const logError = require('../../utils/logErrors');
const { check } = require('express-validator');

let classRequestValidation =  [
    check('comment').isString(),
    check('courseId').isInt(),
    check('userId').isString()
]

classReviewRouter.post('/review', classRequestValidation, verifyToken, (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }


    const {
        comment, userId: user_id, courseId: course_id
    } = req.body;

    const postData = {
        comment, user_id, course_id
    };

    const insertQuery = `INSERT INTO review SET ?`;

    db.query(insertQuery, postData, (err, result) => {
        if(err){
            logError(err);
            return res.status(400).json({
                status: 'error',
                msg: 'class review error, cross check your parameters'
            });
        }

        if(result.affectedRows > 0){
            return res.status(200).json({
                status: 'success',
                data: {
                    comment, userId: user_id, courseId: course_id, reviewId: result.insertId
                }
            });
        }else{
            return res.status(500).json({
                status: 'error',
                msg: 'class review error'
            });
        }
    });

});
module.exports = classReviewRouter;