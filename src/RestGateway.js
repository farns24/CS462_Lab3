
function RestGateway()
{


}

RestGateway.prototype.send = function(url,s)
{
	var options = {
  		'url': url,
  		'method':"POST",
  		'body': s,
  		'headers': {
    		'User-Agent': 'request'
 		 }
	};
 
	function callback(error, response, body) {
  		if (!error && response.statusCode == 200) {
  		}
	}
 
	request(options, callback);

}
module.exports = RestGateway;
