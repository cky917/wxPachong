var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var mime = require('mime');
var router = require('./server/router');
var cors = require('cors');
var app = express();
var resolve = file => path.resolve(__dirname, file);
app.use(express.static('dist'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);
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