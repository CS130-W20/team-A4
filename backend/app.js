var app = require("express")()
var fs = require("fs")
var server = require("http").Server(app)
var io = require("socket.io")(server)
var uuidv4 = require("uuid/v4")
var validator = require('validator');
var { Client } = require("pg")

dev_environment = process.argv[2]

db_config = {
	user: "dbuser" + dev_environment,
	password: "1234",
	database: "devdb" + dev_environment
}

var drop_content_table = "DROP TABLE IF EXISTS app_content;"

var drop_user_table = "DROP TABLE IF EXISTS user_table;"

var drop_room_table = "DROP TABLE IF EXISTS room_table;"

var create_content_table = "CREATE TABLE IF NOT EXISTS app_content (\
							component_id UUID PRIMARY KEY, \
							room_id UUID NOT NULL, \
							location BOX NOT NULL, \
							data VARCHAR, \
							type VARCHAR\
						);"

var create_user_table = "CREATE TABLE IF NOT EXISTS user_table (\
							user_id VARCHAR PRIMARY KEY, \
							user_name VARCHAR, \
							room_id UUID NOT NULL \
						);"

var create_room_table = "CREATE TABLE IF NOT EXISTS room_table (\
							room_id UUID PRIMARY KEY, \
							room_name VARCHAR\
						);"

default_data = {
	"text" : "Enter text here",
	"web"  : "http://ec2-54-184-200-244.us-west-2.compute.amazonaws.com",
	"image": "/home/ubuntu/team-A4/backend/images/default_image.jpg",
	"video": "https://youtu.be/zF9PdMVteOQ"
}

validator_regex = RegExp("^[A-Za-z0-9 ]+$")

var client = new Client(db_config)
client.connect()
client.query(drop_content_table)
client.query(drop_user_table)
client.query(drop_room_table)
client.query(create_content_table)
client.query(create_user_table)
client.query(create_room_table)

var index_path = "/home/ubuntu/team-A4/public/index.html"
server.listen(8080 + parseInt(dev_environment))

app.get("/", function (req, res) {
    res.sendFile(index_path)
})

function validate_name(check_name){
	return typeof check_name === "string" && validator_regex.test(check_name)
}

function log_data(log_name, socket_id, data){
	res_data = log_name + " " + new Date() + "\n	data: " + JSON.stringify(data) + "\n	socket: " + socket_id + "\n"
	console.log(res_data)
	fs.appendFileSync('/home/ubuntu/team-A4/logs/808' + dev_environment + '.log', res_data)
}

function create_room(socket, current_user_name, current_room_name){
	if (validate_name(current_room_name) && validate_name(current_user_name)){
		current_room_id = uuidv4()
		socket.join(current_room_id)
		client.query("INSERT INTO user_table VALUES($1, $2, $3);", [socket.id, current_user_name, current_room_id])
		client.query("INSERT INTO room_table VALUES($1, $2);", [current_room_id, current_room_name])
		res = {
			room_id: current_room_id,
			room_name: current_room_name,
			component : [],
			user_name: [current_user_name]
		}
		socket.emit("create_result", res)
		log_data("Create room result", socket.id, res)
	}else{
		socket.emit("create_result", "invalid input")
		log_data("Create room result", socket.id, {"Error": "invalid input"})
	}
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
						client.query("INSERT INTO user_table VALUES($1, $2, $3);", [socket.id, user_name, room_id])
	
						res.user_name.push(user_name)
						socket.emit("join_result", res)
	
						socket.join(room_id)
						socket.broadcast.to(room_id).emit("join_result", res)

						log_data("Join room result", socket.id, res)
					}else{
						socket.emit("join_result", "room doesn't exist")
						log_data("Join room result", socket.id, {"Error": "room doesn't exist"})
					}	
				})
			})
			
		})
	}else{
		socket.emit("join_result", "invalid input")
		log_data("Join room result", socket.id, {"Error": "invalid input"})
	}
}

function create_component(socket, component_type, room_id){
	if (component_type in default_data){
		
		current_component_id = uuidv4()
		client.query("INSERT INTO app_content VALUES($1, $2, '((0, 0), (100, 100))', $3, $4);", 
					[current_component_id, room_id, default_data[component_type], component_type])
		
		if (component_type == "image"){
			var read_stream = fs.createReadStream(default_data["image"], {encoding: "binary"})
			read_stream.on("data", function(image_data){
				res = {
					component_id: current_component_id,
					component_data: image_data
				}
				socket.broadcast.to(room_id).emit("create_component", res)
				socket.emit("create_component", res)
				log_data("Create component result", socket.id, res)
			})
		}else{
			res = {
				component_id: current_component_id,
				component_data: default_data[component_type]
			}
			socket.broadcast.to(room_id).emit("create_component", res)
			socket.emit("create_component", res)
			log_data("Create component result", socket.id, res)
		}
	}
}	

function update_component(socket, room_id, current_component_id, update_type, current_update_info){
		// Handle update image

		res = {
			component_id: current_component_id,
			update_info: current_update_info
		}
		socket.broadcast.to(room_id).emit("update_component", res)
		log_data("Update component result", socket.id, res)

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
	socket.broadcast.to(room_id).emit("delete_component", component_id)
	log_data("Delete component result", socket.id, {"deleted component": component_id})
}

function remove_user(socket){
	current_room_id = ""
	client.query("SELECT room_id FROM user_table WHERE user_id=$1;", [socket.id])
	.then((data)=>{
		if(typeof data.rows !== "undefined"){
			current_room_id = data.rows[0].room_id
			client.query("DELETE FROM user_table WHERE user_id=$1;", [socket.id])
			.then(()=>{
				client.query("SELECT user_name FROM user_table WHERE room_id=$1;", [current_room_id])
				.then((data)=>{
					socket.broadcast.to(current_room_id).emit("remove_user", data.rows.map(o => o.user_name))
					log_data("Remove user result", socket.id, {"user left": data.rows.map(o => o.user_name)})
				})
			})
		}else{
			log_data("Remove user result", socket.id, {"user left": []})
		}
		
	})	
}

function get_info(socket, room_id){
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
					socket.emit("room_info", res)
					log_data("Get room info result", socket.id, res)
				}else{
					socket.emit("room_info", "room doesn't exist")
					log_data("Get room info result", socket.id, {"Error": "room doesn't exist"})
				}	
			})
		})
		
	})
}

io.on("connection", function (socket) {
	socket.on("create", function(data) {
		log_data("Create room request", socket.id, data)
		create_room(socket, data.user_name, data.room_name)
	})

	socket.on("join", function(data) {
		log_data("Join room request", socket.id, data)
		join_room(socket, data.room_id, data.user_name)
	})

	socket.on("create_component", function (data) {
		log_data("Create component request", socket.id, data)
		create_component(socket, data.component_type, data.room_id)
	})

	socket.on("update_component", function (data) {
		log_data("Update component request", socket.id, data)
		update_component(socket, data.room_id, data.component_id, data.update_type, data.update_info)
	})

	socket.on("delete_component", function (data) {
		log_data("Delete component request", socket.id, data)
		delete_component(socket, data.component_id, data.room_id, data.component_type)
	})

	socket.on("get_info", function (data) {
		log_data("Get room info", socket.id, data)
		get_info(socket, data.room_id)
	})	

	socket.on('disconnect', function(){
		log_data("Remove user request", socket.id, "N/A")
		remove_user(socket)
	});
})
