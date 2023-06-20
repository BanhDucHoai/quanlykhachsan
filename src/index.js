const express = require('express');
require('dotenv').config();

const path = require("path")
const configViewEngine = require('./config/viewengine.config');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const paginate = require("express-paginate");

const PORT = process.env.PORT || 5000;

const app = express();
//Middlewres

app.use(cookieParser());

app.use(express.json() );
app.use(express.urlencoded({ extended: false }) );

// Express Layouts  
app.use('/admin', require('./Routes/login.admin.route'));
app.use('/staff', require('./Routes/login.staff.route'));


app.use(expressLayouts);
//config viewengine
configViewEngine(app);


app.use(paginate.middleware(10, 50));

app.use(express.json() );
app.use(express.urlencoded({ extended: false }) );
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 86400000 1 day
    }
}));


//Routes

app.use('/', require('./Routes/index.route'));

app.use('/customer', require('./Routes/customer.route'));

app.use('/customerstaff', require('./Routes/customerstaff.route'));

app.use('/customertype', require('./Routes/customertype.route'));

app.use('/room', require('./Routes/room.route'));

app.use('/roomstaff', require('./Routes/roomstaff.route'));

app.use('/roomtype', require('./Routes/roomtype.route'));

app.use('/roomservice', require('./Routes/roomservice.route'));

app.use('/book', require('./Routes/book.route'));

app.use('/bookstaff', require('./Routes/bookstaff.route'));

app.use('/booking', require('./Routes/booking.route'));

app.use('/bookingstaff', require('./Routes/bookingstaff.route'));

app.use('/gender', require('./Routes/gender.route'));



app.use('/report', require('./Routes/report.route'));

app.use('/reportstaff', require('./Routes/reportstaff.route'));

app.use('/profile', require('./Routes/profile.route'));

app.use('/profilestaff', require('./Routes/profilestaff.route'));

app.use('/staff', require('./Routes/staff.route'));
//Staff
app.use('/invoice', require('./Routes/invoice.route'));

app.use('/invoicestaff', require('./Routes/invoicestaff.route'));

app.listen(PORT , () => {
    console.log(`SERVER RUNNING http:localhost:${PORT}`);
})

