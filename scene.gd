extends Node


func _ready():
	var error = GameServer.connect("192.168.113.202", 3000)
	if(error): print("Connection error: " + error)


func _on_Button_pressed():
	GameServer.send_message("connect", {username="one"})



#var websocket
#var error
#
#func _process(delta):
	#if !error: error = websocket.listen()
#
#func _ready():
	#websocket = preload('websocket.gd').new(null)
	#error = websocket.connect('192.168.113.202',3000)
	#if error: print(error)
	#websocket.set_receiver(self,'_on_message_received')
#
#func _on_message_received(msg):
	#print(msg)
#
#func _on_Button_pressed():
	#var data = {type="one", msg="what"}
	#websocket.send(JSON.print(data))
#
