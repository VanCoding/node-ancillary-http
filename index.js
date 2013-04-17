var anc = require("ancillary");
var httpjs = require("http.js");

exports.createServer = function(cb){
	var server = anc.createServer();
	server.on("connection",function(c){
		var req = new httpjs.httpParser(c,true);			
		req.on("open",function(res){
			if(req.headers.upgrade == "websocket" || req.headers.connection == "upgrade"){
				req.upgrade = true;
				server.emit("upgrade",req,req.connection,new Buffer(0));
			}else{					
				server.emit("request",req,res);
			}
		});
		req.resume();
	});
	
	if(cb){
        server.on("request",cb);
    }
	
	return server;
}

exports.send = function(name,req){
	socket = req.connection;	
	var data = req.method+" "+req.url+" HTTP/"+req.httpVersion+"\r\n";
	for(var h in req.headers){
		data+=h+": "+req.headers[h]+"\r\n";
	}
	data+= "\r\n";
	anc.send(name,socket,data);
}

exports.proxySpdy = require("./spdyroot.js");