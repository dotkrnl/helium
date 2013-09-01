
/**
 * App routes.
 */

var homepage = require('./homepage');
var user = require('./user');
var passport = require('passport');

module.exports = function(app) {
    app.get('/', homepage.index);
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
}
