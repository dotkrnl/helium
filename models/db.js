
/**
 * Database mongoose.
 */

var dbI = require('../settings').databaseInfo
module.exports = db = require('mongoose')

auth = dbI.username ? 
    ('' + dbI.username + ':' + dbI.password + '@') : '';
host = dbI.host || '127.0.0.1';
port = dbI.port || 27017;
dbn = dbI.db;

db.connect('mongodb://' + auth + host + ':' + port + '/' + dbn);
db.connection.on('error', console.error.bind(console, 'connection error:'));
