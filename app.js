var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var mime = require('mime');
var router = require('./server/router');
var cors = require('cors');
var app = express();
app.use(cors({
    origin:['http://localhost:9000'],
    methods:['GET','POST'],
    alloweHeaders:['Content-Type', 'Authorization']
}));

var resolve = file => path.resolve(__dirname, file);
app.use('/static', express.static(resolve('./static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

app.listen(process.env.PORT || 9001, function() {
    console.log("应用实例，访问地址为 localhost:9001")
});
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});