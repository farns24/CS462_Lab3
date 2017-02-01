var gf = require('../src/GossipFacade.js');
var expect    = require("chai").expect;
//var converter = require("../app/converter");


function RgStub()
{
	this.sent = "";

}

RgStub.prototype.send= function(url,msg,cb)
{
	debugger;
	this.sent = msg;

	cb();
}


describe("Gossip Facade Tests", function() {
	
  describe("Send Rumor test", function() {
    it("Happy Path", function() {
	 var peers = ['host1','host2','host3'];
        var stub = new RgStub();
        var urls = {'host1':'localhost:1111', 'host2':'localhost:2222'};

	var facade = new gf(peers,urls,{},stub);
	facade.state.testing = true;
	facade.state.msg = "Hello World";
	debugger;
	 facade.sendRumor(facade.state,function(){
		var res = JSON.parse(stub.sent);
		expect(res.rumor.text).to.equal("Hello World");	
	
	});	
	debugger;

    });
  });

  describe("Prepare Message test", function() {
    it("Happy Path: text state", function() {
	var peers = [];
	var urls = [];

	var facade = new gf(peers,urls);
	facade.state.msg = "Hello World";

	var res = JSON.parse(facade.prepareMsg(facade.state,"localhost:343"));	
	expect(res.Rumor.Text).to.equal("Hello World");	
	
    });

   it("Test uniqueness of orign ids", function(){
	 var peers = [];
        var urls = [];

        var facade = new gf(peers,urls);
	facade.state.msg = "Hello World";
        var res = JSON.parse(facade.prepareMsg(facade.state,"localhost:343")); 
        var res2 = JSON.parse(facade.prepareMsg(facade.state,"localhost:343"));
//	debugger;
	expect(res.Rumor.MessageID).to.not.equal(res2.Rumor.MessageID);


    });
	
  });

  describe("getPeer Tests", function() {
    it("test happy path", function() {
	 var peers = ['host1','host2','host3'];
        var urls = {'host1':'localhost:1111', 'host2':'localhost:2222'};

        var facade = new gf(peers,urls);

	var peer = facade.getPeer({});
	expect(peer == 'host1'||peer == 'host2').to.equal(true);
    });
  });

  describe("lookup Tests", function() {
    it("test happy path", function() {
         var peers = ['host1','host2','host3'];
        var urls = {'host1':'localhost:1111', 'host2':'localhost:2222'};

        var facade = new gf(peers,urls);

        var peer = facade.getPeer({});
        expect(peer == 'host1'||peer == 'host2').to.equal(true);

	var url = facade.lookup(peer);
	expect(url == 'localhost:1111' || url == 'localhost:2222').to.equal(true);
    });
  });

});
