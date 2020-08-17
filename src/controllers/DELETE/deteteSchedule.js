const deleteScheduleRouter = require('express').Router();
const db = require('../../config/db');
const { verifyToken } = require('../../auth/middleware');
const { validationResult } = require('express-validator');
const logError = require('../../utils/logErrors');
const { check } = require('express-validator');

let deleteScheduleValidation = [
    check('scheduleId', 'parameter must be an integer').exists().toInt().isInt()
]

deleteScheduleRouter.delete('/schedule/:scheduleId', deleteScheduleValidation, verifyToken, (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }

    const {
        scheduleId
    } = req.params;

    if(res.payload.isAdmin === 1 || res.payload.isSubAdmin === 1){
        const deleteQuery = `DELETE FROM schedule WHERE schedule_id='${scheduleId}'`;

        db.query(deleteQuery, (err, result) => {
            if(err){
                logError(err);
                return res.status(400).json({
                    status: 'error',
                    msg: 'delete error, not all values are provided'
                });
            }

            if(result.affectedRows > 0){
                return res.status(200).json({
                    status: 'success',
                    data: 'schedule deleted succesfully'
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
module.exports = deleteScheduleRouter;