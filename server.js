var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var request     = require('request');
const uuidV1 = require('uuid/v1');

var cookieParser = require('cookie-parser');

var https = require('https');

var jwt    = require('jsonwebtoken');

var dbConfig = require('./src/myMongo');
var User = require('./src/User');
//var ChatState = require('./src/ChatState');
var GossipFacade = require('./src/GossipFacade');
var gossipF = new GossipFacade();
var port = 3333;
var chatState = {"rumors":[{"MessageId":"id","Originator":"Bob","Text":"Hello World"}]};
mongoose.connect(dbConfig.database);

var config = require('./config'); 

app.use(bodyParser.json());

app.use(cookieParser());

app.set('superSecret', dbConfig.secret);

app.use(morgan('dev'));
app.get('/setup', function(req, res) {

  // create a sample user
     var mike = new User({ 
    name: 'Mike', 
    password: '',
    admin: true ,
    checkins: []
      });


     	
  
                     // save the sample user
    mike.save(function(err) {
        if (err) throw err;
  
         console.log('User saved successfully');
           res.json({ success: true });
                    });
     });


app.get('/api/fsredirect', function(req,res){
	debugger;
	var url = require('url');
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var code = query.code;
	var cli_id = "1BM5TKMPHSUMBNAQHQ2NQPWQXJ1CJU2LCEVAKEYWGJ2NHZOS";
	var cli_sec = "NXTH2TXJRY3Y3MBTAOWJNQ12ITTV5RHKADHNKYVV0V2CZFHG";	
	var fsUrl = "/oauth2/access_token?client_id="+ cli_id +"&client_secret="+cli_sec  +"&grant_type=authorization_code&redirect_uri=http://104.236.235.18:3333/api/fsredirect&code="+code;

//	debugger;

	var options = {
  	host: 'foursquare.com',
  	port: 8080,
  	path: fsUrl,
 	 method: 'GET'
	};
	

	request('https://foursquare.com' + fsUrl, function(error,fsres,body){
		debugger;
		console.log(body);	
		res.cookie('fs_at',JSON.parse(body).access_token, { maxAge: 900000, httpOnly: true});
		res.redirect('/');

	});

});


app.post('/authenticate', function (req, res) {

  
User.findOne({
    name: req.body.username
  }, function(err, user) {

    if (err) throw err;

  	  if (!user) {
     		 res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

     		    res.cookie('user',user.name,{ maxAge: 900000,httpOnly: true}); 
                    res.redirect('/index.html#/home');             
				 }
 	}); 
 });


app.get('/api/logout',function(req,res){


    request.post("https://foursquare.com/logout",function(err,fres,body)
    {	
	//Redirect
        res.clearCookie('user');
        res.clearCookie('fs_at');
	res.redirect('/index.html#/home');
    });	
});

/**
 * Create new user
 *
 */ 
app.post('/api/user',function(req,res){

	var user = req.body.username;
	debugger;
	var newbie= new User({
    name: user,
    password: '',
    admin: true,
    checkins:[]
      });



                     // save the sample user
               newbie.save(function(err) {
                              if (err) throw err;



				 res.cookie('user',newbie.name,{ maxAge: 900000,httpOnly: true});
         		     res.clearCookie('fs_at'); 
                            console.log('User saved successfully');
                            res.redirect('/index.html#/home');
                });
 });
                     

app.get('/api/currentUser',function(req,res){

	var username = req.cookies.user;
	User.findOne({
    name: username
  }, function(err, user) {

    if (err)  res.json({ success: false, "name": 'notLoggedIn.' });

          if (!user) {
                 res.json({ success: false, "name": 'notLoggedIn.' });
    } else if (user) {
                    res.json({"details": user, "name": username, 'cookies':req.cookies});
                                 }
        });


});

var updateList = function(req,cb){

var accessToken = req.cookies.fs_at;
var user = req.cookies.user;

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd='0'+dd
} 

if(mm<10) {
    mm='0'+mm
} 

today = yyyy+'' +mm+'' +dd;
debugger;
if (typeof accessToken != 'undefined' && typeof user != 'undefined')
{

	request('https://api.foursquare.com/v2/checkins/recent?oauth_token='+ accessToken + "&v="+ today,function(err,fsres,body){
		
	//Store most recent in database
	User.findOne({
    name: user
  }, function(err, user) {
	debugger;
    if (err) throw err;

          if (!user) {
			}
		else
		{
			user.checkins = body;
			user.save(function(err){
					cb();
				});
			}

			});
		});
	} 

}

app.get('/api/user', function(req,res){
        updateList(req,function(){
        User.find({}, function(err, users) {

    res.send(users);
  });
});
});


app.get( "/api/chatstate", function(req,res){
	//Return State of Chat

	res.json(chatState);
//	chatStat
});


app.post( "/api/sendChat", function(req,res){
	//Return State of Chat
	var msg = req.body.msgId;
	chatState.rumors.push({"MessageId":"id","Originator":"Bob","Text":msg});
//	chatStat
});

app.use(express.static('public'));

app.listen(port);

console.log("App Started on port 3333");
