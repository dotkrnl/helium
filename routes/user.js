
/*
 * GET users listing.
 */

var settings = require('../settings');
var passport = require('passport');
var user = require('../models/user');

exports.showRegister = function(req, res) {
    res.render('useredit', {form: {}, title:'加入志愿者'});
};

exports.doRegister = function(req, res) {
    var password = req.body.password;
    res.locals.message.error = res.locals.message.error || [];
    user.normalize.normalizeAll(req.body,
        function(newinfo, errors) {
            var fallback = function(errors) {
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
    var username = req.params.id;
    user.findOne({username: username}).exec(function(err, editing) {
        if (!editing) {
            req.flash('error', '没有找到此用户。');
            return res.redirect('back');
        }
        return res.render('useredit', {form: editing, title: '修改资料'}); 
    });
};

exports.doEditUser = function(req, res) {
    var username = req.params.id;
    var password = req.body.password;
    req.body.password = 'passcheck';
    user.findOne({username: username}).exec(function(err, editing) {
        if (!editing) {
            req.flash('error', '没有找到此用户。');
            return res.redirect('back');
        }
        user.normalize.normalizeAll(req.body,
            function(newinfo, errors) {
                var fallback = function(errors) {
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
                                    return res.redirect('back');
                                });
                            });
                        return res.redirect('back');
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
    res.redirect('back');
}

exports.showList = function(req, res) {
    var info = {title: '人员列表'}
    var page = info.page = Number(req.params.page || '1');
    user.count(function(err, count) {
        if (err) console.log(err);
        info.totpage = Math.ceil(count / settings.perpage);
        var skip = settings.perpage * (page - 1);
        user.find().sort('-create').skip(skip).limit(settings.perpage)
            .find(function(err, userlist){
                info.userlist = userlist;
                return res.render('userlist', info);
            });
    });
};

exports.setAdmin = function(req, res) {
    var username = req.params.id;
    if (username == req.user.username) {
        req.flash('error', '不能取消自己的管理员权限。');
        return res.redirect('back');
    } else {
        user.findOne({username: username}, function(err,editing) {
            if (err) console.log(err);
            if (!editing) {
                req.flash('error', '没有找到此用户。');
                return res.redirect('back');
            }
            editing.isadmin ^= true;
            editing.save(function(err) {
                if (err) {
                    console.log(err);
                    req.flash('error', '无法修改管理员权限。');
                    return res.redirect('back');
                }
                req.flash('success', '管理员权限修改完成。');
                return res.redirect('back');
            });
        });
    }
};
