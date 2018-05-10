// reference: https://gist.github.com/martinsik/2031681

var http = require('http');
var ws = require('websocket').server;

var clients = [];


// Send bad requests to ./public/index.html
var server = http.createServer(function(req, res) {
	res.writeHead(200, { 'Content-type': 'text/html'});
	res.end(fs.readFileSync(__dirname + '/public/index.html'));
}).listen(3000, function() {
	console.log('Listening at: http://localhost:3000');
});


// Start server
var wsServer = new ws({
	httpServer: server,
	autoAcceptConnections: false,
	maxReceivedFrameSize: 125,    // Max of 125 bytes per frame
	maxReceivedMessageSize: 8192	// Max of 8192 bytes per message
});

wsServer.on('request', function(request) {
	try {
		var connection = request.accept('namethiswhatever', request.origin);
	} catch(err) {
		console.log(err);
		return;
	}
	console.log("User Connected: " + connection.remoteAddress.replace("::ffff:","") + " - " + new Date());
	
	// TODO: store client connection with data
	var client = {
		ID: -1,
		channel: "global",
		connected: false,
		connection: connection,
		username: "",
		position: {x:0, y:0}
	};
	
	var clientIndex = clients.push(client);
	client.ID = clientIndex;
	
	connection.on('message', function(msg) {
		
		// TODO: parse message, handle and send appropriate response
		if (msg.type === 'utf8') {
			
			var messageData = JSON.parse(msg.utf8Data);
			
			if(messageData) {
				console.log('Received Message: ' + JSON.stringify(messageData));
				//connection.sendUTF(msg.utf8Data);
				switch(messageData.event) {
					
					case "connect":
						if(client && !client.connected) {
							client.connected = true;
							client.username = messageData.data.username;
							console.log("connecting: client = " + JSON.stringify({client:{ID:client.ID, channel:client.channel, connected:client.connected, username:client.username}}));
							// TODO: dispatch "connected" event - send the server version of the client data back to the player
							// TODO: dispatch "join" event to all players in channel
						}
					break;
					
					case "ping":
						if(client && client.connected) {
							console.log("ping");
							// TODO: measure ping time
							// TODO: dispatch "ping" event back to requesting user
						}
					break;
					
					case "chat":
					break;
					
					case "move":
					break;
					
					case "channel":
					break;
					
					case "disconnect":
					break;
				}
			}
			
		}
		
		// TODO: handle binary messages?
		/*
		else if (msg.type === 'binary') {
			console.log('Received Binary Message of ' + msg.binaryData.length + ' bytes');
			connection.sendBytes(msg.binaryData);
		}
		*/
	});
	
	connection.on('error', function(err) {
		console.log(err);
	});
	
	connection.on('close', function(reasonCode, description) {
		console.log("User Disconnected: " + connection.remoteAddress.replace("::ffff:","") + " - " + new Date());
		
		// TODO: dispatch "left" event
	});
});

/*
function _on_time() {
	var msg = new Date().toString();
	wsServer.connections.forEach(function(client) {
		try {
			client.sendUTF(msg);
		} catch (err) {
			console.log(err);
		}
	});
};

setInterval(_on_time, 3000)
*/
