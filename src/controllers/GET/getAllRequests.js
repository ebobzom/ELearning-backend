const getAllRequestRouter = require('express').Router();
const db = require('../../config/db');
const logError = require('../../utils/logErrors');
getAllRequestRouter.get('/requests', (req, res) => {
 
    let query = `SELECT request_id, subject, topic, request_date, email, student_class FROM class_request`;
    
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
module.exports = getAllRequestRouter;