
/*
 * GET users listing.
 */

var settings = require('../settings');
var news = require('../models/news');
var md = require('markdown').markdown.toHTML;

function firstNumber(str, df) {
    arr = str.match(/\d+/);
    if (arr) return Number(arr[0]);
    else return df;
}

exports.showList = function(req, res) {
    info = {}
    info.page = page = firstNumber(req.path, 1);
    news.count(function(err, count) {
        if (err) console.log(err);
        info.totpage = Math.ceil(count / settings.perpage);
        skip = settings.perpage * (page - 1);
        news.find().sort('-create').skip(skip).limit(settings.perpage)
            .find(function(err, newslist){
                info.newslist = newslist
                return res.render('newslist', info);
            });
    });
};

exports.showItem = function(req, res) {
    newsid = firstNumber(req.path, 0);
    news.findOne({id: newsid}, function(err, newsitem) {
        if (err) console.log(err);
        if (!newsitem) return res.status(404);
        newsitem.content = md(newsitem.content);
        return res.render('newsitem', newsitem);
    });
}

exports.showNewItem = function (req, res) {
    return res.render('newsnew')
}

exports.doNewItem = function (req, res) {
    news.findOne().sort('-id').exec(function(err, last) {
        req.body.id = last ? last.id + 1 : 0;
        item = new news(req.body);
        item.save(function(err) {
            if (err) console.log(err);
            return res.redirect('/news/' + req.body.id);
        });
    });
}

exports.showEditItem = function (req, res) {
    newsid = firstNumber(req.path, 0);
    news.findOne({id: newsid}).exec(function(err, editing) {
        return res.render('newsnew', editing)
    });
}

exports.doEditItem = function (req, res) {
    newsid = req.body.id = firstNumber(req.path, 0);
    news.findOne({id: newsid}).remove(function(err, editing){
        if (err) console.log(err)
        item = new news(req.body);
        item.save(function(err) {
            if (err) console.log(err);
            return res.redirect('/news/' + req.body.id);
        });
    });
}

exports.doDeleteItem = function (req, res) {
    newsid = req.body.id = firstNumber(req.path, 0);
    news.findOne({id: newsid}).remove(function(err, editing){
        if (err) console.log(err);
        return res.redirect('/news');
    });
}
