const express = require('express');
const app = express();
const connection = require('./db');
const bodyParser =require('body-parser')

app.set('view engine', 'pug')
app.use(express.static(__dirname+'public'))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get("/",(req,res)=>{
    let bikes;
    connection.query("select * from bikes",(err,row,fields)=>{
        if(err) return res.send("err")
        bikes = row;
        res.render('booking-form',{
            bikes:row,
            error:false,
            message:""
        })
    })
})

app.post('/',(req,res)=>{
    try {
        let bike_no = req.body.bike_no;
        let from_date = new Date(req.body.from_date);
        let to_date = new Date(req.body.to_date);
        let days = to_date.getTime() - from_date.getTime();
        days = Math.ceil(days / (1000 * 3600 * 24)) + 1;
        from_date = from_date.toISOString().split("T")[0];
        to_date = to_date.toISOString().split("T")[0];
        
        connection.query(`select * from bikes where bike_no = ${bike_no}`,(err,row)=>{
            let rent = row[0].rent;
            let fare = rent*days;
            let license_no = req.body.license_no;
            let bookingsql = `insert into bookings  (from_date,
            fare,
            license_no,
            bike_no,
            to_date) values('${from_date}',${fare},${license_no},${bike_no},'${to_date}');`
            let customersql = `insert into customers values(${license_no},'${req.body.cust_name}',${req.body.mobile},'${req.body.address}',${req.body.aadhar})`
            connection.query(customersql,(err1,row)=>{
                // if(err1) {} 
                connection.query(bookingsql,(err,row)=>{
                    if(err) return res.send("booking query "+err.message);
                    res.render("reciept",{
                        name:req.body.cust_name,
                        license_no:license_no,
                        mobile:req.body.mobile,
                        aadhar:req.body.aadhar,
                        booking_date:new Date().toISOString().split("T")[0],
                        from_date:from_date,
                        to_date:to_date,
                        days:days,  
                        fare:fare 
                    })

                })
            })
        })
    } catch (err) {
        console.log("ERR");
        connection.query("select * from bikes",(err,row)=>{
            if(err) return res.send("err")
            res.render('booking-form',{
                bikes:row,
                error:true,
                message:err.message
        })
    })
    }
    
})

app.get('/admin',(req,res)=>{

    connection.query("select * from bikes",(err,bikes)=>{
        connection.query("select * from customers",(err,cus)=>{
            connection.query("select * from bookings",(err,bookings)=>{

                res.render('admin',{
                    bikes,
                    customers:cus,
                    bookings
                })
            })

        })
    })
})

app.post("/bike",(req,res)=>{
    try {
        connection.query(`insert into bikes values(${req.body.bike_no},'${req.body.bike_name}','${req.body.color}',${req.body.rent})`,(err,data)=>{
            res.redirect('/admin')
        })
        
    } catch (err) {
        res.redirect('/admin')
    }
})

app.post("/delete/:bike_no",(req,res)=>{
    connection.query("delete from bikes where bike_no = " + req.params.bike_no,(err,data)=>{
        res.redirect('/admin')
    })
})

app.post("/cancel/:booking_no",(req,res)=>{
    try {
        
        connection.query("delete from bookings where booking_no = "+req.params.booking_no,(err,data)=>{
            res.redirect('/admin');
        })
    } catch (err) {
        res.redirect('/admin');
    }
})

/*
    Tables - 
        - Bike (bike_no,bike_name,bike_color,rent) per hour
        - Customer (cust_name,licese,aadhar,address,mobile)
        - Booking (bike_no,license,from_date,to_date,fare)

    Routes -
        / - GET form
        / - POST book bike 
 */

app.listen(3000,()=>console.log("Server is running")); 