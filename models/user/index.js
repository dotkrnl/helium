
/**
 * User model library
 */

var db = require('../db');
var schema = require('./schema');

module.exports = db.model('User', schema);
