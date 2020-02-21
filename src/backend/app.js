var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var uuidv4 = require('uuid/v4')
var { Client } = require('pg')

db_config = {
	user: 'dbuser',
	password: '1234',
	database: 'devdb'
}

var create_table = "CREATE TABLE IF NOT EXISTS app_content (\
							component_id UUID PRIMARY KEY, \
							room_id UUID NOT NULL, \
							location BOX NOT NULL, \
							data VARCHAR \
						);"

default_data = {
	'text' : 'Enter text here',
	'web'  : 'http://ec2-54-184-200-244.us-west-2.compute.amazonaws.com'
	// 'image': 'images/default_image.jpg'
}
// TODO: How to send image back

var client = new Client(db_config)
client.connect()
client.query(create_table)

var index_path = '/home/ubuntu/team-A4/public/index.html'
server.listen(80)

app.get('/', function (req, res) {
    res.sendFile(index_path)
})

app.post('/update_component', function (req, res){
	if (req.query.component_type in default_data){

	}else{
		console.error("ERROR: Unrecognized component type")
		res.send("Please send valid request")
	}
})

function create_component(socket, component_type, room_id){
	
	if (component_type in default_data){
		
		current_component_id = uuidv4()
		client.query("INSERT INTO app_content VALUES($1, $2, '((0, 0), (100, 100))', $3);", 
					[current_component_id, room_id, default_data[component_type]])
		
		if (component_type == 'image'){
			// TODO: How to send image back
		}else{
			socket.broadcast.to(room_id).emit("component_data", {
				component_id: current_component_id,
				component_data: default_data[component_type]
			})
		}

	}else{
		console.error("ERROR: Unrecognized component type")
		socket.broadcast.to(room_id).emit("Please send valid request")
	}	
}

function delete_component(socket, component_id, room_id){
	
	client.query("DELETE FROM app_content WHERE component_id=$1", [component_id])
	
	if (component_type == 'image'){
		// TODO: How to delete image
	}
}

io.on('connection', function (socket) {
	socket.on('create', function() {
		current_uuid = uuidv4()
		socket.join(current_uuid)
		// might not need to send back
		socket.emit(current_uuid)
	})

	socket.on('create_component', function (data) {
		create_component(socket, data.component_type, data.room_id)
	})

	socket.on('update_component', function (data) {
		// might not need to get room_id from frotend
		socket.broadcast.to(data.room_id).emit("component_update", data)
	})

	socket.on('delete_component', function (data) {
		delete_component(socket, data.component_id, data.room_id)
	})
})