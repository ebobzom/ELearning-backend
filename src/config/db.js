const mysql = require('mysql');

const connectionString = '';
const configObj = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
};

const config = connectionString || configObj;
const db = mysql.createConnection(config);

db.connect(err => {
    if(err){
        console.log(err.message);
    }
    console.log('database connected');
});

module.exports = db;