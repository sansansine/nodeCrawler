var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

var models = require('./db/db');
var mysql = require('mysql');
var $sql = require('./db/sqlMap');


var app = express();

var conn = mysql.createConnection(models.mysql);
conn.connect();

var sql_food_add = $sql.food.add;
var sql_food_del = $sql.food.del;
var sql_quest_add = $sql.quest.add;
var sql_quest_del = $sql.quest.del;
var sql_search_add = $sql.search.add;
var sql_search_del = $sql.search.del;


//爬取新秀菜谱数据
app.get('/foodNewlist', function (req, res, next) {
    conn.query(sql_food_del, ["new"], function (err, result) {
        if (err) {
            console.log('err');
        } else {
            console.log('delsucc');
        }
    });
    superagent.get('http://www.xiachufang.com/explore/rising/')
        .end(function (err, sres) {
            if (err) return next(err);
            var $ = cheerio.load(sres.text);
            var arr = [];
            $('.normal-recipe-list li').each(function (index, el) {
                var $el = $(el).find('img');
                arr.push(
                    {
                        title: $el.attr('alt'),
                        href: $el.attr('data-src')
                    }
                );
                conn.query(sql_food_add, [$el.attr('alt'), $el.attr('data-src'), "new"], function (err, result) {
                    console.log('result:' + result);
                    if (err) {
                        console.log('err');
                    } else {
                        console.log('addsucc');
                    }
                });
            });
            res.send(arr);
        });
});


//爬取厨房问答数据
app.get('/questlist',function(req,res,next){
    conn.query(sql_quest_del, ["new"], function (err, result) {
        if (err) {
            console.log('err');
        } else {
            console.log('delsucc');
        }
    });
    superagent.get('http://www.xiachufang.com')
        .end(function(err,sres){
            if(err) return next(err);
            var $ = cheerio.load(sres.text);
            var arr=[];
            $('.questions-block li').each(function(index, el) {
                var $el=$(el).find('a');
                arr.push(
                    {
                        question:$el.text()
                    }
                );
                var $obj = $(el).find('span');
                arr.push(
                    {
                        joins:$obj.text()
                    }
                );
                conn.query(sql_quest_add, [$el.text(), $obj.text()], function(err, result) {
                    console.log(result);
                    if (err) {
                        console.log('err');
                    }else {
                        console.log('succ');
                    }
                });

            });
            res.send(arr);
        });
});
//爬取流行菜谱数据
app.get('/foodPoplist',function(req,res,next){
    conn.query(sql_food_del, ["pop"], function (err, result) {
        if (err) {
            console.log('err');
        } else {
            console.log('delsucc');
        }
    });
    superagent.get('http://www.xiachufang.com')
        .end(function(err,sres){
            if(err) return next(err);
            var $ = cheerio.load(sres.text);
            var arr=[];
            $('.pop-recipe-lists a').each(function(index, el) {
                var $el=$(el).find('img');
                arr.push(
                    {
                        title:$el.attr('alt'),
                        img:$el.attr('src')
                    }
                );
                if($el.attr('alt')!==undefined&&$el.attr('src')!==undefined){
                    console.log("yanzheng::"+$el.attr('alt'));
                    conn.query(sql_food_add, [$el.attr('alt'), $el.attr('src'),"pop"], function(err, result) {
                        console.log(result);
                        if (err) {
                            console.log('err');
                        }else {
                            console.log('succ');
                        }
                    });
                }

            });
            res.send(arr);
        });
});

//爬取热门搜索数据
app.get('/searchlist', function (req, res, next) {
    conn.query(sql_search_del, function (err, result) {
        if (err) {
            console.log('err');
        } else {
            console.log('delsucc');
        }
    });
    superagent.get('http://www.xiachufang.com')
        .end(function (err, sres) {
            if (err) return next(err);
            var $ = cheerio.load(sres.text);
            var arr = [];
            $('.pop-keywords li').each(function (index, el) {
                var $el = $(el).find('.num');
                arr.push(
                    {
                        title: $el.text()
                    }
                );
                var $el1 = $(el).find('.ellipsis');
                arr.push(
                    {
                        title: $el1.text()
                    }
                );
                var $el2 = $(el).find('i');
                arr.push(
                    {
                        title: $el2.attr("class")
                    }
                );
                conn.query(sql_search_add, [$el.text(), $el1.text(), $el2.attr("class")], function (err, result) {
                    console.log('result:' + result);
                    if (err) {
                        console.log('err');
                    } else {
                        console.log('addsucc');
                    }
                });
            });
            res.send(arr);
        });
});


//爬取时令食材数据
app.get('/newFoodlist',function(req,res,next){
    conn.query(sql_food_del, ["foot"], function (err, result) {
        if (err) {
            console.log('err');
        } else {
            console.log('delsucc');
        }
    });
    superagent.get('http://www.xiachufang.com')
        .end(function(err,sres){
            if(err) return next(err);
            var $ = cheerio.load(sres.text);
            console.log("sres.text::"+sres.text);
            var arr=[];
            $('.pop-ings-bg a').each(function(index, el) {
                var $el=$(el).find('img');
                arr.push(
                    {
                        title:$el.attr('alt'),
                        img:$el.attr('src')
                    }
                );
                if($el.attr('alt')!==undefined&&$el.attr('src')!==undefined){
                    console.log("yanzheng::"+$el.attr('alt'));
                    conn.query(sql_food_add, [$el.attr('alt'), $el.attr('src'),"foot"], function(err, result) {
                        console.log(result);
                        if (err) {
                            console.log('err');
                        }else {
                            console.log('succ');
                        }
                    });
                }

            });
            res.send(arr);
        });
});


app.listen(5000,function(){
    console.log('listen port 5000');
});
