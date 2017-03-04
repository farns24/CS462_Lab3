/*
Add Method to insert new message to state
remove state from server.js
*/

const uuidV4 = require('uuid/v4');
const us = require('../node_modules/underscore/underscore-min.js');
function GossipFacade(peers, urls,dao,rg,hst)
{
	this.time = 30000;
 	this.host = hst;
	this.dao = dao;
	this.rg = rg;
 	this.updateInterval = 1000;	
	this.state = {'host':hst,'sequence': 0 , 'uid': uuidV4() ,'peers':peers,'urls':urls , 'messages':{}
};

}

GossipFacade.prototype.checkRegistry= function(host)
{
	var urlList = us.values(this.state.urls);
	if (typeof us.find(urlList ,function(hs){return host == hs;})=="undefined")
	{
		var freshNode ="node" + urlList.length; 
		this.state.peers.push(freshNode);
		this.state.urls[freshNode]= host;
		debugger;
	}
}

GossipFacade.prototype.addMessage = function(message)
{
	if (!this.state.uid || typeof this.state.uid == "undefined")
	{
		throw new Exception("Uid is undefined");
	}

//	if (!this.state.sequence || typeof this.state.sequence  == "undefined")
	{
//		throw new Exception("Sequence is undefined");
	}
	this.state.messages[this.state.uid+":"+this.state.sequence++] = message;
}

/**
* 
*@return: random peer
*/
GossipFacade.prototype.getPeer = function(state)
{
	this.state.peers =us.shuffle(this.state.peers);
	
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

GossipFacade.prototype.sendRumor = function(cb)
{
    var self = this;
   
	var q = self.getPeer(self.state);
	var s = self.prepareMsg(self.state,q);
	var url = self.lookup(q);
	self.send(url+ "/api/consumeRumor",self.state,cb);
//	if (self.state.testing==false)
	{
		
	}	
	



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

GossipFacade.prototype.isRumor = function(msg)
{
	return true;//TODO impliment
}

GossipFacade.prototype.isWant = function(msg)
{
	return false;//TODO impliment
}

GossipFacade.prototype.store = function(msg)
{
	var self = this;
	if (typeof msg == "undefined") return;
	if (msg.hasOwnProperty("State") == false) return;
	if (typeof msg.State.hasOwnProperty("messages") == false) return;

	us.each(msg.State.messages,function(val,key){
		debugger;		
		if (!self.state.messages.hasOwnProperty(key))
		{	
			self.state.messages[key] = val;
		}

	});
	
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
