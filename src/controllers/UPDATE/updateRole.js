const updateUserRoleRouter = require('express').Router();
const db = require('../../config/db');
const { verifyToken } = require('../../auth/middleware');
const updateUserRoleValidation = require('../../validation/UPDATE/update-role-validation');
const { validationResult } = require('express-validator');
const logError = require('../../utils/logErrors');

updateUserRoleRouter.put('/role', updateUserRoleValidation, verifyToken, (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }
    // TODO Add logic for preventing convertion of all admins to normal user
    const {
        email, isAdmin: is_admin, isSubAdmin: is_sub_admin,
    } = req.body;

    const postData = [
       is_admin, is_sub_admin, email
    ];
    
    if(res.payload.isAdmin === 1){
        const insertQuery = `UPDATE users SET is_admin = ?, is_sub_admin = ? WHERE email = ?`;

        db.query(insertQuery, postData, (err, result) => {
            if(err){
                logError(err);
                return res.status(400).json({
                    status: 'error',
                    msg: 'user role update error, cross check your parameters'
                });
            }

            if(result.affectedRows > 0){
                return res.status(200).json({
                    status: 'success',
                    data: 'role update made succesfully'
                });
            }else{
                return res.status(500).json({
                    status: 'error',
                    msg: 'role update error'
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
module.exports = updateUserRoleRouter;