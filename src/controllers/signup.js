const express = require('express');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const db = require('../config/db');
const signuRouter = express.Router();

const signupValidation = require('../validation/Create/signup-validation');

signuRouter.post('/', signupValidation, (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(401).json({
            status: 'error',
            error: errors.array()
        });
        return;
    }

    // coverting variable to match db variable casing
    const {
        firstName: first_name,
        lastName: last_name,
        email,
        password,
        isAdmin: is_admin 

    } = req.body;

    const dataSentToDb = {
        first_name,
        last_name,
        password,
        email,
        is_admin: Number(is_admin) || 0
    };

    // check if user exists
    const checkUser = `SELECT email FROM users WHERE email='${dataSentToDb.email}'`
    db.query(checkUser,(queryErr, result) =>{
        if(queryErr){
            res.status(500).json({
                status: 'error',
                error: 'An error occurred, please contact admin'
            });
            return;
        }

        if(result.length > 0){
            res.status(401).json({
                status: 'error',
                error: 'user already exists please login'
            });
            return;
        }

        // hash password

        bcrypt.hash(dataSentToDb.password, 10, (err, hash) => {
            if(err){
                return res.status(500).json({
                    status: 'error',
                    error: 'An error occurred, please contact admin'
                })
            }  

            // modify user password and assign primary key
            dataSentToDb.password = hash;
            const userUUID = uuid.v1().split('-').join('');
            dataSentToDb.user_id = userUUID;

            // create user in db

            const queryString = 'INSERT INTO users SET ?'
            db.query(queryString, dataSentToDb, (dbErr, result) => {

                if(dbErr){
                    res.status(500).json({
                        status: 'error',
                        error: 'An error occurred, please contact admin'
                    })
                    
                    return;
                }

                // generate token and respond

                const payload = {
                    userId: userUUID,
                    isAdmin: dataSentToDb.is_admin
                }

                jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '5h', }, (jwtErr, token) => {
                    if(jwtErr){
                        res.status(500).json({
                            status: 'error',
                            error: 'An error occurred, please contact admin'
                        })
                        return;
                    }
        
                    res.cookie('token', token);
                    res.status(201).json({
                        status: 'success',
                        data: {
                            userId: userUUID,
                            firstName: dataSentToDb.first_name,
                            last_name: dataSentToDb.last_name,
                            email: dataSentToDb.email,
                            token
                        }
                    })
                    return;
                    
                });
                
                return;
            });
            return;
        });
    });

})

module.exports = signuRouter;