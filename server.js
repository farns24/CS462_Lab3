var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var jwt    = require('jsonwebtoken');

var port = 3333;

var config = require('./config'); 

//app.set('superSecret', config.secret);

app.use(express.static('public'));

app.listen(port);

console.log("App Started on port 3333");
