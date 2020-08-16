const express = require('express');
const cookieparser = require('cookie-parser');
const helmet = require('helmet');
const fileupload = require('express-fileupload');
const rateLimit = require("express-rate-limit");
const morgan = require('morgan');
const hpp = require('hpp');
require('dotenv').config();

const signuRouter =  require('./src/controllers/CREATE/signup');
const loginRouter =  require('./src/controllers/login');
const logout = require('./src/controllers/logout');
const comfirmEmailController = require('./src/controllers/GET/confirmEmail');
const forgotPasswordRouter = require('./src/controllers/CREATE/forgotPassword');
const resetPasswordRouter = require('./src/controllers/UPDATE/resetPassword');
const userImageUpload = require('./src/controllers/CREATE/uploadImage');
const changePasswordRouter = require('./src/controllers/UPDATE/changePassword');
const resentUserEmailConfirmation = require('./src/controllers/CREATE/resendConfirmEmail');

// teacher
const addTeacherRouter = require('./src/controllers/CREATE/addTeacher');
const updateTeacherRouter = require('./src/controllers/UPDATE/updateTeacher');
const deleteTeacherRouter = require('./src/controllers/DELETE/deleteTeacher');

// courses
const getCourses = require('./src/controllers/GET/getCourses');
const addCoursesRouter = require('./src/controllers/CREATE/addCourse');
const updateCourseRouter = require('./src/controllers/UPDATE/updateCourse');
const deleteCourseRouter = require('./src/controllers/DELETE/deleteCourse');

// schedule
const getOneScheduleRouter = require('./src/controllers/GET/getOneSchedule');
const getAllScheduleRouter = require('./src/controllers/GET/getAllSchedule');
const addScheduleRouter = require('./src/controllers/CREATE/schedule');
const updateScheduleRouter = require('./src/controllers/UPDATE/updateSchedule');
const deleteScheduleRouter = require('./src/controllers/DELETE/deteteSchedule');

// class request
const getOneRequestRouter = require('./src/controllers/GET/getOneRequest');
const getAllRequestRouter = require('./src/controllers/GET/getAllRequests');
const classRequestRouter = require('./src/controllers/CREATE/classRequest');
const updateClassRequestRouter = require('./src/controllers/UPDATE/updateClassRequest');
const deleteClassRequestRouter = require('./src/controllers/DELETE/deleteClassRequest');

// class review
const getCourseReviewsRouter = require('./src/controllers/GET/getCourseReviews');
const classReviewRouter = require('./src/controllers/CREATE/createReview');
const updateClassReviewRouter = require('./src/controllers/UPDATE/updatedReview');
const deleteClassReviewRouter = require('./src/controllers/DELETE/deleteReview');

// role update
const updateUserRole = require('./src/controllers/UPDATE/updateRole');


const baseUrl = process.env.BASE_URL;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});


const app = express();
const PORT = process.env.PORT || 4000;
var expiryDate = new Date(Date.now() + 60 * 60 * 5000) // 5 hours

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieparser({
    secure: false, // TODO: turn to true before hosting so as to make it accept request from https only
    httpOnly: true,
    expires: expiryDate
}));
app.use(morgan('combined'));
app.use(limiter);
app.use(hpp());
app.use(fileupload({ useTempFiles: true }));

// All Routes
app.use(baseUrl + '/signup', signuRouter);
app.use(baseUrl + '/login', loginRouter);
app.use(baseUrl + '/logout', logout);
app.use(baseUrl + '/comfirmEmail', comfirmEmailController);
app.use(baseUrl, forgotPasswordRouter);
app.use(baseUrl, resetPasswordRouter);
app.use(baseUrl, userImageUpload);
app.use(baseUrl, changePasswordRouter);

// teacher
app.use(baseUrl, addTeacherRouter);
app.use(baseUrl, updateTeacherRouter);
app.use(baseUrl, deleteTeacherRouter);

// courses

app.use(baseUrl, getCourses);
app.use(baseUrl, addCoursesRouter);
app.use(baseUrl, updateCourseRouter);
app.use(baseUrl, deleteCourseRouter);

// schedule 
app.use(baseUrl, getAllScheduleRouter);
app.use(baseUrl, getOneScheduleRouter);
app.use(baseUrl, addScheduleRouter);
app.use(baseUrl, updateScheduleRouter);
app.use(baseUrl, deleteScheduleRouter);

// class request 
app.use(baseUrl, getOneRequestRouter);
app.use(baseUrl, getAllRequestRouter);
app.use(baseUrl, classRequestRouter); 
app.use(baseUrl, updateClassRequestRouter);
app.use(baseUrl, deleteClassRequestRouter);

// course review 
app.use(baseUrl, getCourseReviewsRouter);
app.use(baseUrl, classReviewRouter);
app.use(baseUrl, updateClassReviewRouter); 
app.use(baseUrl, deleteClassReviewRouter);

// admin update user role
app.use(baseUrl, updateUserRole);

// resend email
app.use(baseUrl, resentUserEmailConfirmation);

// error handler
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        status: 'error',
        msg: 'an error ocurred'
    });
    return;
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
