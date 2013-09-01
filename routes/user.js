
/*
 * GET users listing.
 */

var passport = require('passport');
var user = require('../models/user');

exports.showRegister = function(req, res) {
    res.render('register');
};

exports.doRegister = function(req, res) {
    user.register(
        new user({ username : req.body.username }),
        req.body.password,
        function(err, newuser) {
            if (err) {
                req.flash('error', '抱歉，此手机号已被使用。');
                return res.redirect('/user/register');
            }
            req.login(newuser, function(err) {
                if (err) console.log(err);
                return res.redirect('/');
            });
        }
    );
};

exports.showSignin = function(req, res) {
    res.render('signin', { user : req.user });
};

exports.doSignout = function(req, res) {
    req.logout();
    res.redirect('/');
}
