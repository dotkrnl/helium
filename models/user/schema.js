
/**
 * User model schema
 */

var db = require('../db');
var Schema = db.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

module.exports = new Schema({
    fullname:   String,
    "class":    String,
    gender:     String,
    email:      String,
    want:       String,
    advice:     String,
    isadmin:    { type: Boolean, default: false }, 
    create:     { type: Date, default: Date.now, index: true }
});

module.exports.plugin(passportLocalMongoose);

