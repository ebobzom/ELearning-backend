const getOneScheduleRouter = require('express').Router();
const db = require('../../config/db');
const { validationResult } = require('express-validator');
const logError = require('../../utils/logErrors');
const { check } = require('express-validator');

let getOneScheduleValidation = [
    check('email', 'parameter must be an integer').exists().isEmail()
]


getOneScheduleRouter.get('/schedule/:email', getOneScheduleValidation, (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }

    const { email } = req.params
 
    let query = `SELECT schedule_id, course_title, s.description, course_owner_email, start_time, schedule_date, full_name AS teachers_name, t.description FROM schedule AS s, teachers AS t WHERE s.course_owner_email='${email}'`;
    
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
module.exports = getOneScheduleRouter;