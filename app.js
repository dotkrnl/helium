
/**
 * Module dependencies.
 */

var express = require('express');
var settings = require('./settings');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var flash = require('connect-flash');

var passport = require('passport');
var User = require('./models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var app = express();

// all environments
app.set('host', '127.0.0.1');
app.set('port', process.env.PORT || settings.defaultPort);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(settings.secret));
app.use(express.session(settings.sessionDB));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.website = settings.website;
    res.locals.user = req.user;
    res.locals.message = {
        success: req.flash('success'),
        error:   req.flash('error'),
    }
    next();
});
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

routes(app);

http.createServer(app).listen(app.get('port'), app.get('host'), function(){
    console.log('MSVA server listening on port ' + app.get('port'));
});
