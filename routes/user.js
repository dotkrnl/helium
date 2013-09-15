
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
                    if (err) {
                        console.log(err);
                        return fallback(['抱歉，此手机号已被使用。']);
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

exports.showEditUser = function(req, res) {
    username = req.params.id;
    user.findOne({username: username}).exec(function(err, editing) {
        if (!editing) {
            req.flash('error', '没有找到此用户。');
            return res.redirect('/');
        }
        return res.render('useredit', {form: editing, title: '修改资料'}); 
    });
};

exports.doEditUser = function(req, res) {
    username = req.params.id;
    password = req.body.password;
    req.body.password = 'passcheck';
    user.findOne({username: username}).exec(function(err, editing) {
        user.normalize.normalizeAll(req.body,
            function(newinfo, errors) {
                fallback = function(errors) {
                    errors.forEach(function(err) {
                        res.locals.message.error.push(err);
                    });
                    return res.render('useredit', {form: newinfo, title:'修改资料'});
                };
                if (errors) return fallback(errors);
                delete newinfo['password'];
                user.findOne({username: newinfo.username}).exec(function(err, found) {
                    if (editing.username != newinfo.username && found)
                        return fallback(['抱歉，此手机号已被使用。']);
                    Object.keys(newinfo).forEach(function(key) {
                        editing[key] = newinfo[key];
                    });
                    editing.save(function(err) {
                        if (err) return fallback([err]);
                        req.flash('error', '用户资料已更新。');
                        if (password)
                            return editing.setPassword(password, function() { 
                                editing.save(function(err) {
                                    if (err) return fallback([err]);
                                    req.flash('success', '用户密码已修改。');
                                    return res.redirect('/user/' + username + '/edit');
                                });
                            });
                        return res.redirect('/user/' + username + '/edit');
                    });
                });
            });
    });
};

exports.showSignin = function(req, res) {
    res.render('signin', { title: '登陆', user : req.user });
};

exports.doSignout = function(req, res) {
    req.logout();
    res.redirect('/');
}
