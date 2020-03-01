var app = require("express")()
var fs = require("fs")
var server = require("http").Server(app)
var io = require("socket.io")(server)
var uuidv4 = require("uuid/v4")
var validator = require('validator');
var { Client } = require("pg")

db_config = {
	user: "dbuser",
	password: "1234",
	database: "devdb"
}

var create_content_table = "CREATE TABLE IF NOT EXISTS app_content (\
							component_id UUID PRIMARY KEY, \
							room_id UUID NOT NULL, \
							location BOX NOT NULL, \
							data VARCHAR, \
							type VARCHAR\
						);"

var create_user_table = "CREATE TABLE IF NOT EXISTS user_table (\
							room_id UUID NOT NULL, \
							user_name VARCHAR\
						);"

var create_room_table = "CREATE TABLE IF NOT EXISTS room_table (\
							room_id UUID PRIMARY KEY, \
							room_name VARCHAR\
						);"

default_data = {
	"text" : "Enter text here",
	"web"  : "http://ec2-54-184-200-244.us-west-2.compute.amazonaws.com",
	"image": "/home/ubuntu/team-A4/backend/images/default_image.jpg"
}

var client = new Client(db_config)
client.connect()
client.query(create_content_table)
client.query(create_user_table)
client.query(create_room_table)

var index_path = "/home/ubuntu/team-A4/public/index.html"
server.listen(8080)

app.get("/", function (req, res) {
    res.sendFile(index_path)
})

function validate_name(check_name){
	return typeof check_name === "string" && check_name.match("^[A-Za-z0-9 ]+$")
}

function create_room(socket, current_user_name, current_room_name){
	if (validate_name(current_room_name) && validate_name(current_user_name)){
		current_room_id = uuidv4()
		socket.join(current_room_id)
		client.query("INSERT INTO user_table VALUES($1, $2);", [current_room_id, current_user_name])
		client.query("INSERT INTO room_table VALUES($1, $2);", [current_room_id, current_room_name])
		socket.emit("create_result", {
			room_id: current_room_id,
			room_name: current_room_name,
			component : [],
			user_name: [current_user_name]
		})
	}else
		socket.emit("create_result", "invalid input")
}

function join_room(socket, room_id, user_name){
	if (typeof room_id === "string" && validator.isUUID(room_id) && validate_name(user_name)){
		res = {
			room_id: room_id,
			room_name: "",
			component : [],
			user_name: []
		}

		client.query("SELECT * FROM app_content WHERE room_id=$1;", [room_id])
		.then((data) => {res.component = data.rows})
		.then(() => {
			client.query("SELECT user_name FROM user_table WHERE room_id=$1;", [room_id])
			.then((data) => {res.user_name = data.rows.map(o => o.user_name)})
			.then(() => {
				client.query("SELECT room_name FROM room_table WHERE room_id=$1;", [room_id])
				.then((data) => {res.room_name = data.rows[0].room_name})
				.then(()=>{
					if(res.user_name.length){
						client.query("INSERT INTO user_table VALUES($1, $2);", [room_id, user_name])
	
						res.user_name.push(user_name)
						socket.emit("join_result", res)
	
						socket.join(room_id)
						socket.broadcast.to(room_id).emit("join_result", res)
					}else
						socket.emit("join_result", "invalid input")
				})
			})
			
		})
	}else
		socket.emit("join_result", "invalid input")
}

function create_component(socket, component_type, room_id){
	if (component_type in default_data){
		
		current_component_id = uuidv4()
		client.query("INSERT INTO app_content VALUES($1, $2, '((0, 0), (100, 100))', $3, $4);", 
					[current_component_id, room_id, default_data[component_type], component_type])
		
		if (component_type == "image"){
			var read_stream = fs.createReadStream(default_data["image"], {encoding: "binary"})
			read_stream.on("data", function(image_data){
				socket.broadcast.to(room_id).emit("image_data", {
					component_id: current_component_id,
					component_data: image_data
				})
				socket.emit("image_data", {
					component_id: current_component_id,
					component_data: image_data
				})
			})
		}else{
			socket.broadcast.to(room_id).emit("create_component", {
				component_id: current_component_id,
				component_data: default_data[component_type]
			})
		}
	}
}	

function update_component(socket, room_id, current_component_id, update_type, current_update_info){
		// Handle update image

		socket.broadcast.to(room_id).emit("update_component", {
			component_id: current_component_id,
			update_info: current_update_info
		})

		if(update_type == "update_finished"){
			client.query("UPDATE app_content SET location=$1, data=$2 WHERE component_id=$3;", 
						[current_update_info.location, current_update_info.data, current_component_id])
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
	socket.on("create", function(data) {
		create_room(socket, data.user_name, data.room_name)
	})

	socket.on("join", function(data) {
		join_room(socket, data.room_id, data.user_name)
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

	socket.on('disconnect', function(){
		
	});
})
