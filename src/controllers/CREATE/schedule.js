const addScheduleRouter = require('express').Router();
const db = require('../../config/db');
const { verifyToken } = require('../../auth/middleware');
const addScheduleValidation = require('../../validation/CREATE/create-schedule-validation.js');
const { validationResult } = require('express-validator');
const logError = require('../../utils/logErrors');

addScheduleRouter.post('/schedule', addScheduleValidation, verifyToken, (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }

    const {
        courseTitle: course_title, description, scheduleDate: schedule_date,
        courseOwnerEmail: course_owner_email, teacherId: teacher_id, startTime: start_time
    } = req.body;

    const postData = {
        course_title, description, schedule_date,
        course_owner_email, teacher_id, start_time
    };

    if(res.payload.isAdmin === 1 || res.payload.isSubAdmin === 1){
        const insertQuery = `INSERT INTO schedule SET ?`;

        db.query(insertQuery, postData, (err, result) => {
            if(err){
                logError(err);
                return res.status(400).json({
                    status: 'error',
                    msg: 'schedule insertion error, cross check your parameters'
                });
            }

            if(result.affectedRows > 0){
                return res.status(200).json({
                    status: 'success',
                    data: {
                        courseTitle: course_title, description, scheduleDate: schedule_date,
                        courseOwberEmail: course_owner_email, teacherId: teacher_id, startTime: start_time, sheduleId: result.insertId
                    }
                });
            }else{
                return res.status(500).json({
                    status: 'error',
                    msg: 'schedule insertion error'
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
module.exports = addScheduleRouter;