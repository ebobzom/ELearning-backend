const deleteReviewRouter = require('express').Router();
const db = require('../../config/db');
const { verifyToken } = require('../../auth/middleware');
const deleteReviewValidation = require('../../validation/DELETE/review-validation');
const { validationResult } = require('express-validator');
const logError = require('../../utils/logErrors');

deleteReviewRouter.delete('/review/:reviewId', deleteReviewValidation, verifyToken, (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }

    const {
        reviewId
    } = req.params;

    if(res.payload.isAdmin === 1 || res.payload.isSubAdmin === 1){
        const deleteQuery = `DELETE FROM review WHERE review_id='${reviewId}'`;

        db.query(deleteQuery, (err, result) => {
            if(err){
                logError(err);
                return res.status(400).json({
                    status: 'error',
                    msg: 'delete error, not all values were provided'
                });
            }

            if(result.affectedRows > 0){
                return res.status(200).json({
                    status: 'success',
                    data: 'review deleted succesfully'
                });
            }else{
                return res.status(500).json({
                    status: 'error',
                    msg: 'delete error, params needed/course not found'
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
module.exports = deleteReviewRouter;