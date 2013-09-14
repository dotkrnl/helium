
/**
 * App settings.
 */

var express = require('express');
var mongoStore = require('connect-mongo')(express);

var website = '志愿者协会';
var defaultPort = 3000;
var cookieSecret = "secretcode";
var databaseInfo = {
    db: 'helium',
}

module.exports = {
    website: website,
    defaultPort: defaultPort,
    secret: cookieSecret,
    databaseInfo: databaseInfo,
    sessionDB: {
        secret: cookieSecret,
        store: new mongoStore(databaseInfo),
    },
    perpage: 10,
};
