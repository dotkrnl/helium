
/*
 * GET users listing.
 */

var passport = require('passport');
var user = require('../models/user');

exports.showRegister = function(req, res) {
    res.render('useredit', {form: {}, title:'加入志愿者'});
};

exports.doRegister = function(req, res) {
    password = req.body.password;
    res.locals.message.error = res.locals.message.error || [];
    user.normalize.normalizeAll(req.body,
        function(newinfo, errors) {
            fallback = function(errors) {
                errors.forEach(function(err) {
                    res.locals.message.error.push(err);
                });
                return res.render('useredit', {form: newinfo, title:'加入志愿者'});
            };
            if (errors) return fallback(errors);
            delete newinfo['password'];
            user.register(
                new user(newinfo),
                password,
                function(err, newuser) {
                    console.log(err);
                    if (err) return fallback(['抱歉，此手机号已被使用。']);
                    req.login(newuser, function(err) {
                        if (err) console.log(err);
                        req.flash('success', '泉州一中志愿者协会感谢您的加入！');
                        return res.redirect('/');
                    });
                }
            );
        });
};

exports.showEditUser = function(req, res) {

};

exports.showSignin = function(req, res) {
    res.render('signin', { user : req.user });
};

exports.doSignout = function(req, res) {
    req.logout();
    res.redirect('/');
}
