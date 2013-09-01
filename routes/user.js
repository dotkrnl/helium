
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
                return res.render('register', { account : account });
            }
            req.login(newuser, function(err) {
                if (err) console.log(err);
                return res.redirect('/users/' + req.user.username);
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
