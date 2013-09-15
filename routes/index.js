
/**
 * App routes.
 */

var homepage = require('./homepage');
var user = require('./user');
var news = require('./news');
var test = require('./test');
var passport = require('passport');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/user/signin?redirect=' + req.path);
}


function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isadmin) { return next(); }
    res.redirect('/user/signin?redirect=' + req.path);
}

function ensurePermission(req, res, next) {
    if (req.isAuthenticated() && req.user.isadmin)
        { return next(); }
    if (req.isAuthenticated() &&
            req.user.username == req.params.id)
        { return next(); }
    res.redirect('/user/signin?redirect=' + req.path);
}

module.exports = function(app) {
    app.get('/', homepage.index);

    app.get('/user', user.showList);
    app.get('/user/page/:page(\\d+)', user.showList);
    app.get('/user/register', user.showRegister);
    app.post('/user/register', user.doRegister);
    app.get('/user/signin', user.showSignin);
    app.post('/user/signin', passport.authenticate('local',
        { successRedirect: '/',
          successFlash: '登录成功，欢迎回来。',
          failureRedirect: '/user/signin',
          failureFlash: '抱歉，手机号或密码错误。',
        }));
    app.get('/user/signout', user.doSignout);
    app.get('/user/:id(\\d{8,13})/edit', ensurePermission, user.showEditUser);
    app.post('/user/:id(\\d{8,13})/edit', ensurePermission, user.doEditUser);
    
    app.get('/news', news.showList);
    app.get('/news/page/:page(\\d+)', news.showList);
    app.get('/news/:id(\\d+)', news.showItem);
    app.get('/news/:id(\\d+)/edit', ensureAdmin, news.showEditItem);
    app.post('/news/:id(\\d+)/edit', ensureAdmin, news.doEditItem);
    app.get('/news/:id(\\d+)/delete', ensureAdmin, news.doDeleteItem);
    app.get('/news/post', ensureAdmin, news.showNewItem);
    app.post('/news/post', ensureAdmin, news.doNewItem);

    app.get('/test', test);
    app.get('*', function(req, res){
        res.render('homepage', {title: '404'});
    });
}
