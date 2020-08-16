const getCourseReviewsRouter = require('express').Router();
const db = require('../../config/db');
const { verifyTokenForFetchingCourses } = require('../../auth/middleware');
const logError = require('../../utils/logErrors');
getCourseReviewsRouter.get('/reviews', verifyTokenForFetchingCourses, (req, res) => {

    const { amount } = req.params;

    if(!res.registeredUser){
        let query = `SELECT review_id, r.course_id, r.user_id, review_date, comment, first_name, last_name FROM review AS r, users AS u WHERE r.user_id = u.user_id`;
        
        db.query(query, (err, result) => {
            if(err){
                logError(err);
                return res.status(400).json({
                    status: 'error',
                    msg: 'an error occured, cross check your parameters'
                });
            }

        
            return res.status(200).json({
                status: 'success',
                data: result
            });
        });
    }else{
        let query = `SELECT review_id, r.course_id, r.user_id, review_date, comment, first_name, last_name FROM review AS r, users AS u WHERE r.user_id = u.user_id`
        
        db.query(query, (err, result) => {
            if(err){
                logError(err);
                return res.status(400).json({
                    status: 'error',
                    msg: 'an error occured, cross check your parameters'
                });
            }
            
            return res.status(200).json({
                status: 'success',
                data: {
                    reviews: result
                }
            });
            
        });
    }

});
module.exports = getCourseReviewsRouter;