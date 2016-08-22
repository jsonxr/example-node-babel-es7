import { install } from 'source-map-support';
install();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var handlebarsExpress = require('express-handlebars');
var handlebars = require('handlebars');

// var routes = require('./routes/index');

var app = express();

// view engine setup
app.engine('handlebars', handlebarsExpress.create({
  handlebars: handlebars,
  helpers: {
    // injectClientEnvVariables: function() {
    //   /*eslint-disable */
    //   return new handlebars.SafeString('<script language="JavaScript">var PENSCO_ENV = ' +
    //     JSON.stringify(env.getClientAccessibleVariables()) + '</script>');
    //   /*eslint-enable */
    // }
  }
}).engine);

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../browser', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../browser')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

console.log('env: ', app.get('env'));
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}


module.exports = app;
