var app = require("express")()
var server = require("http").Server(app)
var io = require("socket.io")(server)
var uuidv4 = require("uuid/v4")
var { Client } = require("pg")

db_config = {
	user: "dbuser",
	password: "1234",
	database: "devdb"
}

var create_table = "CREATE TABLE IF NOT EXISTS app_content (\
							component_id UUID PRIMARY KEY, \
							room_id UUID NOT NULL, \
							location BOX NOT NULL, \
							data VARCHAR, \
							type VARCHAR\
						);"

default_data = {
	"text" : "Enter text here",
	"web"  : "http://ec2-54-184-200-244.us-west-2.compute.amazonaws.com"
	// "image": "images/default_image.jpg"
}
// TODO: How to send image back

var client = new Client(db_config)
client.connect()
client.query(create_table)

var index_path = "/home/ubuntu/team-A4/public/index.html"
server.listen(8080)

app.get("/", function (req, res) {
    res.sendFile(index_path)
})

function create_component(socket, component_type, room_id){
	
	if (component_type in default_data){
		
		current_component_id = uuidv4()
		client.query("INSERT INTO app_content VALUES($1, $2, '((0, 0), (100, 100))', $3, $4);", 
					[current_component_id, room_id, default_data[component_type], component_type])
		
		if (component_type == "image"){
			// TODO: How to send image back
		}else{
			socket.broadcast.to(room_id).emit("create_component", {
				component_id: current_component_id,
				component_data: default_data[component_type]
			})
		}

	}else{
		console.error("ERROR: Unrecognized component type")
		socket.broadcast.to(room_id).emit("invalid_component", "Please send valid request")
	}
}	

function update_component(socket, room_id, curr_component_id, update_type, curr_update_info){

		socket.broadcast.to(room_id).emit("update_component", {
			component_id: curr_component_id,
			update_info: curr_update_info
		})

		if(update_type == "update_finished"){
			client.query("UPDATE app_content SET location=$1, data=$2 WHERE component_id=$3;", 
						[curr_update_info.location, curr_update_info.data, curr_component_id])
			// Don"t need speical handler for image?
		}
}

function delete_component(socket, component_id, room_id, component_type){
	
	client.query("DELETE FROM app_content WHERE component_id=$1;", [component_id])
	
	if (component_type == "image"){
		// TODO: How to delete image
	}
	socket.broadcast.to(room_id).emit("updated_component", component_id)
}

io.on("connection", function (socket) {
	socket.on("create", function() {
		current_uuid = uuidv4()
		socket.join(current_uuid)
		// might not need to send back
		socket.emit("create_success", current_uuid)
	})

	socket.on("join", function(data) {
		socket.join(data.room_id)
		client.query("SELECT * FROM app_content WHERE room_id=$1;", [data.room_id])
		.then(
			function(data){
				if (data.rows.length)
					socket.emit("join_success", data.rows)
				else
					socket.emit("join_success", "invalid room_id")
			}
		)
	})

	socket.on("create_component", function (data) {
		create_component(socket, data.component_type, data.room_id)
	})

	socket.on("update_component", function (data) {
		// might not need to get room_id from frotend
		update_component(socket, data.room_id, data.component_id, data.update_type, data.update_info)
	})

	socket.on("delete_component", function (data) {
		delete_component(socket, data.component_id, data.room_id, data.component_type)
	})
})
