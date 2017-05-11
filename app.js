var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var mime = require('mime');
var router = require('./server/router');
var setTimeSave = require('./server/setTimesave');
var cors = require('cors');
var app = express();
var resolve = file => path.resolve(__dirname, file);
var AV = require('leancloud-storage');
var APP_ID = 'HTRShSyq1KiVWrXs1aDklJwF-gzGzoHsz';
var APP_KEY = 'tm7fn1jcR7DBHulyr8z0aL3x';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

app.use(express.static('dist'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);
setTimeSave();
app.get('/index', function(req, res) {
    const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8')
    res.send(html)
})
app.listen(process.env.PORT || 9000, function() {
    console.log("应用实例，访问地址为 localhost:9000")
});
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// 访问静态资源文件 这里是访问所有dist目录下的静态资源文件
app.use(express.static(path.resolve(__dirname, '../dist')))

// 监听8088端口
app.listen(8088);