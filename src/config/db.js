const mysql = require('mysql');
// db string: mysql://b34d60a8b0b0d9:3c1f968f@us-cdbr-east-02.cleardb.com/heroku_cc84d2bfa69a0d9?reconnect=true
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
db.on('error', (err) => {
    console.log('database error: ', err.message)
})

module.exports = db;