const uuidV4 = require('uuid/v4');
const us = require('../node_modules/underscore/underscore-min.js');
function GossipFacade(peers, urls,dao,rg)
{
	this.time = 30000;
 	this.host = "host";
	this.dao = dao;
	this.rg = rg;
	this.state = {'sequence': 0 , 'uid': uuidV4() ,'peers':peers,'urls':urls , 'messages':{"ABCD-1234-ABCD-1234-ABCD-1234:5":
			{
                		"Originator": "Phil",
                		"Text": "Hello World!",
				"EndPoint": "localhost:3222" 
                	}
		}
};

}
/**
* 
*@return: random peer
*/
GossipFacade.prototype.getPeer = function(state)
{
	us.shuffle(this.peers);
	
	return this.state.peers[0];
}
/**
* @return: json string of message
*/
GossipFacade.prototype.prepareMsg = function(state,q)
{
//	debugger;
	return JSON.stringify({"Rumor" : {"MessageID": state.uid+ ":"+ state.sequence++ ,
                "Originator": "test Name",
                "Text": state.msg 
                },
     "EndPoint": this.host 
    });
}
/**
* lookup url from peer
* 
*/
GossipFacade.prototype.lookup = function(peer)
{
	
	return this.state.urls[peer];
}

GossipFacade.prototype.sendRumor = function(state,cb)
{
    var self = this;
    setTimeout(function(){

	var q = self.getPeer(state);
	var s = self.prepareMsg(state,q);
	var url = self.lookup(q);
	self.send(url,s,cb);
	if (state.testing==false)
	{
		setTimeout(self.time,this);
	}	
	});

}
/**
*
*@cb: Callback
*/
GossipFacade.prototype.send = function(url,s,cb)
{
	this.rg.send(url,s,cb);
}

GossipFacade.prototype.update = function(state,s)
{
	var state2 = this.dao.getState();
	//merge states
	

	this.dao.setState(state);
	return state;
}

GossipFacade.prototype.handleRumor = function(msg)
{
	var t = msg;
	if (this.isRumor(t))
	{
		this.store(t);
	}
	else if (this.isWant(t))
	{
		work_queue = self.addWorkToQueue(t);
		us.each(work_queue,function(w,idx){
			var s = self.prepareMsg(state,w);
			var url = self.getUrl(w);
			self.send(url,s);
			var state = self.update(state,s);
		});

	}

}

GossipFacade.prototype.wantRumor = function()
{
	//Load all Messages Recieved
	var msgIds = this.getMessageIds();

	var wantMsg = {"Want":msgIds,'EndPoint': this.host};

	return JSON.stringify(wantMsg);
	

}

GossipFacade.prototype.getMessageIds = function()
{
	return this.dao.getState();

}

module.exports = GossipFacade;
