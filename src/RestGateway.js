
var request = require('request');

function RestGateway()
{


}

RestGateway.prototype.send = function(url,s,cb)
{
	if (typeof s == "object")
	{
//		s = JSON.stringify(s);
	}
	var options = {
  		'url': url,
  		'method':"POST",
		'json': true,
  		'body': {State:s},
	};
	function callback(error, response, body) {
  		if (!error && response.statusCode == 200) {
  		}
	}
 
	request(options, cb);

}
module.exports = RestGateway;
