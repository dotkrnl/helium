
/**
 * App routes.
 */

var homepage = require('./homepage');
var user = require('./user');

module.exports = function(app) {
    app.get('/', homepage.index);
    app.get('/users', user.list);
}
