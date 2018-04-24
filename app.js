var createError = require('http-errors');
var express = require('express');
var fs = require('file-system');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var randomstring = require("randomstring");
var cookieSession = require('cookie-session');

var app = express();
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieSession({
    name: 'session',
    //secret: randomstring.generate(),
    keys: [""],
    signed: true,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: false
}));

// use routes for swagger tests
app.use('/admin/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// use routes for each collection

fs.readdirSync('./routes/').forEach(file => {
    app.use('/', require('./routes/' + file));
});

app.use('/', require('./public'));

// catch 404 and forward to overview
 app.use(function (req, res) {
     res.status(302).redirect('/play');
 });

// error handler
 app.use(function (err, req, res) {
     // set locals, only providing error in development
     res.locals.message = err.message;
     res.locals.error = req.app.get('env') === 'development' ? err : {};

     // render the error page
     res.status(err.status || 500);
     res.render('error');
 });



module.exports = app;
