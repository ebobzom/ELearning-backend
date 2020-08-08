/**
 * LOGIC
 * 1) fetch user image url base on user ID.
 * 2) if image url is nit null insert new image
 * 3) else delete old image from cloudinary and insert new image url in database
 */

const path = require('path');
const del = require('del');
const userImageUpload = require('express').Router();
const { validationResult } = require('express-validator');
const { verifyToken} = require('../../middleware/middleware');
const cloudinary = require('../../config/cloudinary'); 
const db = require('../../config/db');
const logError = require('../../utils/logErrors');
const dir = path.resolve(__dirname, '../../../tmp');

userImageUpload.post('/image', verifyToken, (req, res) => {
    const userImage = req.files.image;
    const userId = res.payload.userId;

    function uploadImage(imagePath){
        cloudinary.uploader.upload(imagePath, (err, cloudinaryResult) => {
            if(err){
                logError(err);
                return res.status(500).json({
                    status: "error",
                    error: 'An error occured'
                });
            }
            const { secure_url, public_id } = cloudinaryResult;
    
            // insert into db
            const queryString = `UPDATE users SET user_image_url='${secure_url}', user_image_id='${public_id}' WHERE user_id='${userId}'`
            db.query(queryString, (dbErr, result) => {
                if(dbErr){
                    logError(dbErr);
                    return res.status(500).json({
                        status: "error",
                        error: 'An error occured'
                    });
                    
                }
    
                if(result.affectedRows > 0){
                    // delete tmp folder
                    (async () => {
                        try {
                            await del(dir);
                    
                            console.log(`${dir} is deleted!`);
                        } catch (err) {
                            console.error(`Error while deleting ${dir}.`);
                        }
                    })();
                    return res.status(201).json({
                        status: 'success',
                        msg: `user image url ${secure_url}`
                    });
                }
    
                return res.status(500).json({
                    status: "error",
                    error: 'An error occured'
                });
            })
    
        });
    }

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(401).json({
            status: "error",
            error: errors.array()
        });
    }
    // fetch user from DB
    const userQuery = `SELECT user_image_url, user_image_id FROM users WHERE user_id='${res.payload.userId}'`;
    db.query(userQuery, (err, result) => {
        if(err){
            logError(err);
            return res.status(500).json({
                status: "error",
                error: 'An error occured'
            });
        }

        if(!result[0].user_image_id){
            uploadImage(userImage.tempFilePath);
        }else{
            cloudinary.uploader.destroy(result[0].user_image_id, { invalidate: true}, (err, returneData) => {
                if(err){
                    logError(err);
                    return res.status(500).json({
                        status: 'success',
                        msg: 'cloudinary error'
                    });
                }

                if(returneData.result === 'ok'){
                    uploadImage(userImage.tempFilePath);
                    // delete tmp folder
                    (async () => {
                        try {
                            await del(dir);
                    
                            console.log(`${dir} is deleted!`);
                        } catch (err) {
                            console.error(`Error while deleting ${dir}.`);
                        }
                    })();
                } else{
                    return res.status(401).json({
                        status: 'error',
                        error: 'An error occurred'
                    });
                }
            })
        }
    });

    
});

module.exports = userImageUpload;
