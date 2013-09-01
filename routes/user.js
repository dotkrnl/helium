
/*
 * GET users listing.
 */

var passport = require('passport');
var user = require('../models/user');

exports.showRegister = function(req, res) {
    res.render('register');
};

exports.doRegister = function(req, res) {
    password = req.body.password;
    user.normalize.normalizeAll(req.body,
        function(newinfo, errors) {
            if (errors) {
                errors.forEach(function(err) {
                    req.flash('error', err);
                });
                return res.redirect('/user/register');
            }
            delete newinfo['password'];
            user.register(
                new user(newinfo),
                password,
                function(err, newuser) {
                    if (err) {
                        console.log(err);
                        req.flash('error', '抱歉，此手机号已被使用。');
                        return res.redirect('/user/register');
                    }
                    req.login(newuser, function(err) {
                        if (err) console.log(err);
                        req.flash('success', '泉州一中志愿者协会感谢您的加入！');
                        return res.redirect('/');
                    });
                }
            );
        });
};

exports.showSignin = function(req, res) {
    res.render('signin', { user : req.user });
};

exports.doSignout = function(req, res) {
    req.logout();
    res.redirect('/');
}
