const addCourseRouter = require('express').Router();
const db = require('../../config/db');
const { verifyToken } = require('../../auth/middleware');
const addCourseValidation = require('../../validation/CREATE/course-addition-validation');
const { validationResult } = require('express-validator');
const logError = require('../../utils/logErrors');

addCourseRouter.post('/course', addCourseValidation, verifyToken, (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }

    const {
        courseTitle: course_title, subject, description, courseUrl: course_url, courseDuration: course_duration,
        ownerEmail: owner_email, teacherId: teacher_id, paidCourse: paid_course
    } = req.body;

    const postData = {
        course_title, subject, description, course_url, course_duration,
        owner_email, teacher_id, paid_course
    };

    if(res.payload.isAdmin === 1 || res.payload.isSubAdmin === 1){
        const insertQuery = `INSERT INTO courses SET ?`;

        db.query(insertQuery, postData, (err, result) => {
            if(err){
                logError(err);
                return res.status(400).json({
                    status: 'error',
                    msg: 'course insertion error, cross check your parameters'
                });
            }
            console.log(result)
            if(result.affectedRows > 0){
                return res.status(200).json({
                    status: 'success',
                    data: {
                        courseTitle: course_title, subject, description, courseUrl: course_url, courseDuration: course_duration,
                        ownerEmail: owner_email, teacherId: teacher_id, courseId: result.insertId
                    } 
                });
            }else{
                return res.status(500).json({
                    status: 'error',
                    msg: 'course insertion error'
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
module.exports = addCourseRouter;