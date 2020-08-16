const getAllScheduleRouter = require('express').Router();
const db = require('../../config/db');
const logError = require('../../utils/logErrors');
getAllScheduleRouter.get('/schedule', (req, res) => {
 
    let query = `SELECT schedule_id, course_title, s.description, course_owner_email, start_time, schedule_date, full_name AS teachers_name, t.description FROM schedule AS s, teachers AS t`;
    
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

});
module.exports = getAllScheduleRouter;