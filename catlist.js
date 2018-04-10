var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

var models = require('./db/dbcat');
var mysql = require('mysql');
var $sql = require('./db/sqlMapcat');


var app = express();

var conn = mysql.createConnection(models.mysql);
conn.connect();

var sql = $sql.cat.add;

//爬取cat数据
app.get('/catlist',function(req,res,next){
    superagent.get('https://dribbble.com/search?page=2&q=cat')
        .end(function(err,sres){
            if(err) return next(err);
            var $ = cheerio.load(sres.text);
            var arr=[];
            console.log('into');
            $('#main li').each(function(index, el) {
                console.log('tesst1');
                var $el=$(el).find('img');
                var $elone=$(el).find('.fav a');
                var $eltwo=$(el).find('.cmnt span');
                var $elthree=$(el).find('.views span');
                arr.push(
                    {
                        img:$el.attr('src'),
                        title:$el.attr('alt'),
                        likes:$elone.text(),
                        commonts: parseInt($eltwo.text()),
                        views:$elthree.text()
                    }
                );

                conn.query(sql, [$el.attr('alt'), $el.attr('src'),$elone.text(),parseInt($eltwo.text()),$elthree.text()], function(err, result) {
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


app.listen(9000,function(){
    console.log('listen port 9000');
});
