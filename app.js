var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');
var confirmRouter = require('./routes/confirmSurvey');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



//server logging
app.use(logger('dev'));

//body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//use the static directory name + public folder which has css in stylesheets folder
app.use(express.static(path.join(__dirname, 'public')));

// use the routes that I specified/required in header of page
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/about', aboutRouter);
app.use('/confirmSurvey', confirmRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


mongoose.Promise = global.Promise;
//connecting to local db
mongoose.connect("mongodb://localhost:27017/node-demo1");


//schema for the user
var nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email:String,
    phone:String,
    age:String
});

//schema for the survey
var surveySchema = new mongoose.Schema({
    rating: String,
    selector:String

});


//variable 'User' to reference later
var User = mongoose.model("User", nameSchema);

//variable 'Survey' to reference later
var Survey = mongoose.model("Survey", surveySchema);

//post that data to the database
app.post("/test-page", (req, res) => {
    var myData = new User(req.body);
    myData.save()
        .then(item => {

                res.redirect('/users');

        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});
app.post("/rating-survey", (req,res) => {
    var starRating = new Survey(req.body);
    starRating.save()
        .then(item => {
        res.redirect('/confirmSurvey');

    })
        .catch(err => {
        res.status(400).send("Fail");
    });

});





module.exports = app;
