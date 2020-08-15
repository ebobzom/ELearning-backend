const updateClassReviewRouter = require('express').Router();
const db = require('../../config/db');
const { verifyToken } = require('../../auth/middleware');
const updateClassRequestValidation = require('../../validation/UPDATE/review-validation');
const { validationResult } = require('express-validator');
const logError = require('../../utils/logErrors');

updateClassReviewRouter.put('/review', updateClassRequestValidation, verifyToken, (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }


    const {
        comment, userId: user_id, courseId: course_id, reviewId: review_id
    } = req.body;

    const postData = [
        comment, user_id, course_id, review_id
    ];

    const query = `UPDATE review SET  comment = ?, user_id = ?, course_id = ?, WHERE review_id = ?`;

    db.query(query, postData, (err, result) => {
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
                data: 'class review updated succesfully'
            });
        }else{
            return res.status(500).json({
                status: 'error',
                msg: 'class review update error'
            });
        }
    });

});
module.exports = updateClassReviewRouter;