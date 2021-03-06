
/*
 * GET users listing.
 */

var settings = require('../settings');
var news = require('../models/news');
var md = require('markdown').markdown.toHTML;

exports.showList = function(req, res) {
    var info = {title: '新闻列表'}
    var page = info.page = Number(req.params.page || '1');
    news.count(function(err, count) {
        if (err) console.log(err);
        info.totpage = Math.ceil(count / settings.perpage);
        var skip = settings.perpage * (page - 1);
        news.find().sort('-create').skip(skip).limit(settings.perpage)
            .find(function(err, newslist){
                info.newslist = newslist;
                return res.render('newslist', info);
            });
    });
};

exports.showItem = function(req, res) {
    var newsid = Number(req.params.id);
    news.findOne({id: newsid}, function(err, newsitem) {
        if (err) console.log(err);
        if (!newsitem) {
            req.flash('error', '未找到此新闻');
            return res.redirect('/news');
        }
        newsitem.content = md(newsitem.content);
        var info = {news: newsitem, title: newsitem.title};
        return res.render('newsitem', info);
    });
}

function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

exports.showNewItem = function (req, res) {
    date = dateToYMD(new Date());
    return res.render('newsedit', {form: {}, date: date, title: '添加新闻'});
}

exports.doNewItem = function (req, res) {
    res.locals.message.error = res.locals.message.error || [];
    news.findOne().sort('-id').exec(function(err, last) {
        req.body.id = last ? last.id + 1 : 0;
        var item = new news(req.body);
        item.save(function(err) {
            if (err) {
                res.locals.message.error.push('新闻添加失败，可能是日期格式错误。');
                return res.render('newsedit', {form: req.body, title: '添加新闻'})
            }
            req.flash('success', '新闻已添加！');
            return res.redirect('/news/' + req.body.id);
        });
    });
}

exports.showEditItem = function (req, res) {
    var newsid = Number(req.params.id);
    news.findOne({id: newsid}).exec(function(err, editing) {
        if (err || !editing) {
            req.flash('error', '未找到此新闻');
            return res.redirect('back');
        }
        var date = dateToYMD(editing.create);
        return res.render('newsedit', {form: editing, date:date, title: '修改新闻'});
    });
}

exports.doEditItem = function (req, res) {
    var newsid = req.body.id = Number(req.params.id);
    news.findOne({id: newsid}, function(err, editing){
        if (err) {
            console.log(err);
            req.flash('error', '未找到此新闻');
            return req.redirect('back');
        }
        Object.keys(req.body).forEach(function(key) {
            editing[key] = req.body[key];
        });
        editing.save(function(err) {
            if (err) {
                console.log(err);
                res.locals.message.error.push('新闻修改失败，可能是日期格式错误。');
                return res.render('newsedit', {form: req.body, title: '修改新闻'});
            }
            req.flash('success', '新闻已修改！');
            return res.redirect('/news/' + req.body.id);
        });
    });
}

exports.doDeleteItem = function (req, res) {
    var newsid = req.body.id = Number(req.params.id);
    news.findOne({id: newsid}).remove(function(err, editing){
        if (err) req.flash('error', err);
        if (!editing) req.flash('error', '未找到此新闻。');
        else req.flash('success', '新闻已删除！');
        return res.redirect('/news');
    });
}
