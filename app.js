const express = require('express');
const cookieparser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const hpp = require('hpp');
require('dotenv').config();

const signuRouter =  require('./src/controllers/signup');
const loginRouter =  require('./src/controllers/login');
const logout = require('./src/controllers/logout');
const comfirmEmailController = require('./src/controllers/GET/confirmEmail');
const forgotPasswordRouter = require('./src/controllers/CREATE/forgotPassword');

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
app.use(limiter);
app.use(hpp());

// All Routes
app.use(baseUrl + '/signup', signuRouter);
app.use(baseUrl + '/login', loginRouter);
app.use(baseUrl + '/logout', logout);
app.use(baseUrl + '/comfirmEmail', comfirmEmailController);
app.use(baseUrl, forgotPasswordRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
