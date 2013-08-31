
/*
 * GET users listing.
 */

var passport = require('passport');
var user = require('../models/user');

exports.showreg = function(req, res) {
    res.render('register', { });
};

exports.doreg = function(req, res) {
    user.register(
        new user({ username : req.body.username }),
        req.body.password,
        function(err, newuser) {
            if (err) {
                return res.render('register', { account : account });
            }
            req.login(newuser, function(err) {
                if (err) { throw err; }
                return res.redirect('/users/' + req.user.username);
            });
        }
    );
};

exports.list = function(req, res){
  res.send("respond with a resource");
};
