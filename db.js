const mysql = require('mysql')

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"BikeRentalSystem",
    password:"password@123"
})

connection.connect((err)=>{
    if(err) console.log("DB not connected"  + err.message);
    else {
        console.log("DB Connected ");
    }  
})


module.exports = connection;