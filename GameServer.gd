# GameServer
# wrapper around the websocket class for communicating with the nodejs / socket.io based game app server

var websocket
var error

var server = {
	host = "127.0.0.1",
	port = 3000
}

var client = {
	ID = -1,
	channel = "global",
	connected = false
}


func _init(host="127.0.0.1", port=3000):
	print("_init: host = " + host + " | port = " + String(port))
	
	server.host = host
	server.port = port
	
	websocket = preload('websocket.gd').new(null)


func connect():
	if(websocket):
		error = websocket.connect(server.host, server.port)
		if error: print(error)
		websocket.set_receiver(self, "_on_message_received")


func disconnect():
	# TODO: disconnect
	pass


func update():
	if(websocket and !error):
		error = websocket.listen()
		
		# TODO: handle errors (popup, etc?)


func _on_message_received(msg):
	# TODO: parse messages, dispatch and deal with them accordingly
	print("Received message: " + msg)
	
	# TODO: "connected"
	# TODO: "chat"
	# TODO: "join"
	# TODO: "left"
	# TODO: "ping"


func change_channel(channel):
	# TODO: change channel
	# TODO: notify server
	pass


func ping():
	send_message("ping")


func send_message(event, data, broadcast=false, target_client_ID=-1):
	if(websocket):
		var message = {
			event = event,
			client = client,
			data = data,
			broadcast = broadcast,
			target_client_ID = target_client_ID
		}
		websocket.send(JSON.print(message))
