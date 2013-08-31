
/**
 * Module dependencies.
 */

var express = require('express');
var settings = require('./settings');
var routes = require('./routes');
var http = require('http');
var path = require('path');

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
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

routes(app);

http.createServer(app).listen(app.get('port'), app.get('host'), function(){
    console.log('MSVA server listening on port ' + app.get('port'));
});
