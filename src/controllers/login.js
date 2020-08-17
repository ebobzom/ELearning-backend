const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const db = require('../config/db');
const logError = require('../utils/logErrors');
const loginRouter = express.Router();
const { check } = require('express-validator');

const loginValidation = [
    check('email').isEmail().withMessage('invalid email'),
    check('password').isLength({ min: 5, max: 15 }).withMessage('password must be more than 5 and less than 16 characters'),
]

loginRouter.post('/', loginValidation, (req, res) => {
    // grap user datails
    const {
        email, password
    } = req.body

    // validate inputs
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(401).json({
            status: 'error',
            msg: errors.array()
        });
        return;
    }

    // check if email and password are valid
    const dbQuery = `SELECT user_id, email, password, first_name, last_name, is_admin, is_sub_admin FROM users WHERE email='${email}'`;
    db.query(dbQuery, (dbErr, result) => {
        if(dbErr){
            logError(dbErr);
            res.status(501).json({
                status: 'error',
                msg: dbErr.message
            });
            return;
        }

        // if users with given email is not found respond approprately
        if(result.length ===  0){
            res.status(401).json({
                status: 'error',
                msg: 'incorrect email or password'
            });
            return;
        }

        // check if user password is correct
        const hashedPasswordFromDb = result[0].password;
        bcrypt.compare(password, hashedPasswordFromDb, (passwordErr, valid) => {
            if(passwordErr){
                logError(passwordErr);
                res.status(500).json({
                    status: 'error',
                    msg: 'incorrect email or password'
                });
                return;
            }
            if(valid){

                const payload = {
                    userId: result[0].user_id,
                    isAdmin: result[0].is_admin,
                    email: email,
                    isSubAdmin: result[0].is_sub_admin
                };

                jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '10h' }, (err, tokenValue) => {
                    if(err){
                        logError(err);
                        res.status(501).json({
                            status: 'error',
                            msg: 'An error occurred please contact admin'
                        });
                        return;
                    }

                    // get courses with there reviews, user requests and schedule

                    let freeUserQuery = `SELECT course_id, course_title, subject, c.description as course_description, course_url, 
                    course_duration, full_name as teacher, t.description teacher_info FROM courses AS c, teachers AS t WHERE paid_course = 0`;
                    let paidUSERCoursesQuery =`SELECT course_id, course_title, subject, c.description as course_description, course_url, 
                    course_duration, full_name as teacher, t.description teacher_info FROM courses AS c, teachers AS t WHERE owner_email='${email}'`;
                    let reviewsQuery = `SELECT review_id, r.course_id, r.user_id, review_date, comment, first_name, last_name FROM review AS r, users AS u WHERE r.user_id = u.user_id`;
                    db.query(freeUserQuery, (err, val1) => {
                        if(err){
                            logError(err);
                            res.status(501).json({
                                status: 'error',
                                msg: 'An error occurred please contact admin'
                            });
                            return;
                        }

                        let freeUserQueryResult = val1;

                        db.query(paidUSERCoursesQuery, (err, val2) => {
                            if(err){
                                logError(err);
                                res.status(501).json({
                                    status: 'error',
                                    msg: 'An error occurred please contact admin'
                                });
                                return;
                            }
                            let paidUSERCoursesQueryResult = val2;

                            db.query(reviewsQuery, (err, val3) =>{
                                if(err){
                                    logError(err);
                                    res.status(501).json({
                                        status: 'error',
                                        msg: 'An error occurred please contact admin'
                                    });
                                    return;
                                }
                                let reviewsQueryResult = val3;

                                // send response
                                res.cookie('token', tokenValue);
                                return res.status(200).json({
                                    status: 'success',
                                    data: {
                                        userDetails: {
                                            userId: result[0].user_id,
                                            firstName: result[0].first_name,
                                            lastName: result[0].last_name,
                                            email: result[0].email,
                                            token: tokenValue
                                        },
                                        courses:{
                                            freeCourses: freeUserQueryResult,
                                            paidCourse: paidUSERCoursesQueryResult,
                                            courseReviews: reviewsQueryResult
                                        }
                                    }
                                }); 
                            });
                        });
                        
                    });
                });
                return;
            }else{
                // for invalid password
                return res.status(501).json({
                    status: 'error',
                    msg: 'incorrect email or password'
                });
            }   
        });
    });

});

module.exports = loginRouter;