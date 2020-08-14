const updateScheduleRouter = require('express').Router();
const db = require('../../config/db');
const { verifyToken } = require('../../auth/middleware');
const updateScheduleValidation = require('../../validation/UPDATE/update-schedule-validation');
const { validationResult } = require('express-validator');
const logError = require('../../utils/logErrors');

updateScheduleRouter.put('/schedule', updateScheduleValidation, verifyToken, (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }

    const {
        courseTitle: course_title, description, scheduleDate: schedule_date,
        courseOwnerId: course_owner_id, teacherId: teacher_id, startTime: start_time, scheduleId: schedule_id
    } = req.body;

    const postData = [
        course_title, description, schedule_date,
        course_owner_id, teacher_id, start_time, schedule_id
    ];

    if(res.payload.isAdmin === 1 || res.payload.isSubAdmin === 1){
        const insertQuery = `UPDATE schedule SET course_title = ?, description = ?, schedule_date = ?,
        course_owner_id = ?, teacher_id = ?, start_time = ? WHERE schedule_id = ?`;

        db.query(insertQuery, postData, (err, result) => {
            if(err){
                logError(err);
                return res.status(400).json({
                    status: 'error',
                    msg: 'schedule update error, cross check your parameters'
                });
            }

            if(result.affectedRows > 0){
                return res.status(200).json({
                    status: 'success',
                    data: 'schedule updated succesfull'
                });
            }else{
                return res.status(500).json({
                    status: 'error',
                    msg: 'schedule update error'
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
module.exports = updateScheduleRouter;