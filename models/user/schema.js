
/**
 * User model schema
 */

var db = require('../db');
var Schema = db.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

module.exports = new Schema({
    fullName:   String,
});

module.exports.plugin(passportLocalMongoose);

