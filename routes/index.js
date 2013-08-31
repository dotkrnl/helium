
/**
 * App routes.
 */

var homepage = require('./homepage');
var user = require('./user');

module.exports = function(app) {
    app.get('/', homepage.index);
    app.get('/user/register', user.showreg);
    app.post('/user/register', user.doreg);
}
