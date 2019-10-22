// dependencies
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const morgan = require('morgan');
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express();

// require('.', passport)
const initializeLocal = require('./config/passport')
initializeLocal(passport)
// console.log(passport)

//morgan as logger
app.use(morgan('dev'))

//express middleware
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

//template middleware
app.use(expressLayouts);
app.set('view engine', 'ejs')

// Express Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash Dependency
app.use(flash())

//global variables

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
  })

// routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

//db options
const dbUri = require('./config/keys')
// console.log(dbUri)
const dbOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
};

//connect to database
mongoose.connect(dbUri, dbOptions, (err, success) => {
    if (err) {
        return console.error(err);
    }
    console.log('Connection Status: Success');
});



app.listen(3000, console.log('Listening on Port 3000'));