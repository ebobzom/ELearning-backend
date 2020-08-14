const updateCourseRouter = require('express').Router();
const db = require('../../config/db');
const { verifyToken } = require('../../auth/middleware');
const updateCourseValidation = require('../../validation//UPDATE/course-update-validation');
const { validationResult } = require('express-validator');
const logError = require('../../utils/logErrors');
updateCourseRouter.put('/course', updateCourseValidation, verifyToken, (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }

    const {
        courseTitle: course_title, subject, description, courseUrl: course_url, courseDuration: course_duration,
        courseOwnerId: course_owner_id, teacherId: teacher_id, courseId: course_id
    } = req.body;

    const postData = [
        course_title, subject, description, course_url, course_duration,
        course_owner_id, teacher_id, course_id
    ];

    if(res.payload.isAdmin === 1 || res.payload.isSubAdmin === 1){
        const insertQuery = `UPDATE courses SET course_title = ?, subject = ?, description = ?, course_url = ?,
        course_duration = ?, course_owner_id = ?, teacher_id = ? WHERE course_id = ?`;

        db.query(insertQuery, postData, (err, result) => {
            if(err){
                logError(err);
                return res.status(400).json({
                    status: 'error',
                    msg: 'course update error, cross check your parameters'
                });
            }

            if(result.affectedRows > 0){
                return res.status(200).json({
                    status: 'success',
                    data: 'course update succesfull'
                });
            }else{
                return res.status(500).json({
                    status: 'error',
                    msg: 'course update error'
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
module.exports = updateCourseRouter;