const getCourseRouter = require('express').Router();
const db = require('../../config/db');
const { verifyTokenForFetchingCourses } = require('../../auth/middleware');
const logError = require('../../utils/logErrors');

const { check } = require('express-validator');

let amountValidation = [
    check('amount', 'parameter must be an integer').exists().isInt()
]

getCourseRouter.get('/courses/:amount', amountValidation, verifyTokenForFetchingCourses, (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }

    const { amount } = req.params;
    console.log('regis',res.registeredUser)
    if(!res.registeredUser){
        let query = `SELECT course_id, course_title, subject, c.description as course_description, course_url, 
        course_duration, full_name as teacher, t.description teacher_info, paid_course FROM courses AS c, teachers AS t WHERE paid_course = 0`; 
        
        if(typeof Number(amount) === 'number'){
            query += ` LIMIT ${amount}`;
        }
        
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
        let query = `SELECT course_id, course_title, subject, c.description as course_description, course_url, 
        course_duration, full_name as teacher, t.description teacher_info FROM courses AS c, teachers AS t WHERE paid_course = 0`;
        
        let secondQuery = `SELECT course_id, course_title, subject, c.description as course_description, course_url, 
        course_duration, full_name as teacher, t.description teacher_info FROM courses AS c, teachers AS t WHERE owner_email='${res.payload.email}'`;
        
        if(typeof Number(amount) === 'number'){
            query += ` LIMIT ${amount}`;
        }
        
        db.query(query, (err, result) => {
            if(err){
                logError(err);
                return res.status(400).json({
                    status: 'error',
                    msg: 'an error occured, cross check your parameters'
                });
            }
            db.query(secondQuery, (err1, result2) => {              
                if(err1){
                    logError(err1);
                    return res.status(400).json({
                        status: 'error',
                        msg: 'an error occured, cross check your parameters'
                    });
                }

                return res.status(200).json({
                    status: 'success',
                    data: {
                        unpaidCourses: result,
                        paidCourses: result2
                    }
                });
            });
        });
    }

});
module.exports = getCourseRouter;