var http     = require('http');
var schedule = require("node-schedule");//定时任务爬取数据

function httpFoodNew(){
    var uri = 'http://localhost:5000/foodNewlist';
    http.get(uri, function(res) {
        console.log("succ: ") ;
    }).on('error', function(e) {
        console.log("error: "+e.message);
    });
}
function httpFoodPop(){
    var uri = 'http://localhost:5000/foodPoplist';
    http.get(uri, function(res) {
        console.log("succ: ") ;
    }).on('error', function(e) {
        console.log("error: "+e.message);
    });
}

function httpQuestion(){
    var uri = 'http://localhost:5000/questlist';
    http.get(uri, function(res) {
        console.log("succ: ") ;
    }).on('error', function(e) {
        console.log("error: "+e.message);
    });
}
function httpSearch(){
    var uri = 'http://localhost:5000/searchlist';
    http.get(uri, function(res) {
        console.log("succ: ") ;
    }).on('error', function(e) {
        console.log("error: "+e.message);
    });
}

var rule2     = new schedule.RecurrenceRule();
var times2    = [1,2,3,16,21,26,31,36,41,46,51,56];
rule2.minute  = times2;
schedule.scheduleJob(rule2, function(){
    console.log('run one time');
    httpFoodNew();
    httpFoodPop();
    httpQuestion();
    httpSearch();
});