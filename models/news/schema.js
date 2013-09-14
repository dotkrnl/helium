
/**
 * News model schema
 */

var db = require('../db');
var Schema = db.Schema;

module.exports = new Schema({
    title: String,
    author: String,
    content: String,
    create: { type: Date, default: Date.now },
    id: {type: Number, index: {unique: true}},
});