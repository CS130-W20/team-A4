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
							location VARCHAR NOT NULL, \
							data VARCHAR, \
							type VARCHAR\
						);"

var create_user_table = "CREATE TABLE IF NOT EXISTS user_table (\
							user_id VARCHAR PRIMARY KEY, \
							user_name VARCHAR, \
							user_avatar VARCHAR, \
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
	"video": "https://youtu.be/zF9PdMVteOQ",
	"location": "300,400,100,100"
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
	res_data = log_name + " " + new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"}) + "\n	data: " + JSON.stringify(data) + "\n	socket: " + socket_id + "\n"
	console.log(res_data)
	fs.appendFileSync('/home/ubuntu/team-A4/logs/808' + dev_environment + '.log', res_data)
}

function create_room(socket, current_user_name, current_room_name, current_user_avatar){
	if (validate_name(current_room_name) && validate_name(current_user_name)){
		current_room_id = uuidv4()
		socket.join(current_room_id)
		client.query("SELECT user_avatar FROM user_table WHERE user_id=$1", [socket.id])
		.then((data)=>{
			if(typeof data.rows[0] === "undefined"){
				client.query("INSERT INTO user_table VALUES($1, $2, $3, $4);", [socket.id, current_user_name, current_user_avatar, current_room_id])
			}else{
				current_user_avatar = data.rows[0].user_avatar
				client.query("UPDATE user_table SET user_name=$1, room_id=$2 WHERE user_id=$3;", [current_user_name, current_room_id, socket.id])
			}
			client.query("INSERT INTO room_table VALUES($1, $2);", [current_room_id, current_room_name])

			res = {
				room_id: current_room_id,
				room_name: current_room_name,
				component : [],
				user_name: [current_user_name],
				user_avatar: [current_user_avatar]
			}
			socket.emit("create_result", res)
			log_data("Create room result", socket.id, res)
		})
	}else{
		socket.emit("create_result", "invalid input")
		log_data("Create room result", socket.id, {"Error": "invalid input"})
	}
}

function join_room(socket, room_id, user_name, current_user_avatar){
	if (typeof room_id === "string" && validator.isUUID(room_id) && validate_name(user_name)){
		res = {
			room_id: room_id,
			room_name: "",
			component : [],
			user_name: [],
			user_avatar: []
		}

		client.query("SELECT * FROM app_content WHERE room_id=$1;", [room_id])
		.then((data) => {res.component = data.rows})
		.then(() => {
			client.query("SELECT user_name, user_avatar FROM user_table WHERE room_id=$1;", [room_id])
			.then((data) => {
				res.user_name = data.rows.map(o => o.user_name)
				res.user_avatar = data.rows.map(o => o.user_avatar)
			})
			.then(() => {
				client.query("SELECT room_name FROM room_table WHERE room_id=$1;", [room_id])
				.then((data) => {res.room_name = data.rows[0].room_name})
				.then(()=>{
					client.query("INSERT INTO user_table VALUES($1, $2, $3, $4);", [socket.id, user_name, current_user_avatar, room_id])
					.then(()=>{
						res.user_name.push(user_name)
						res.user_avatar.push(current_user_avatar)
						socket.join(room_id)
						socket.emit("join_result", res)
						socket.broadcast.to(room_id).emit("join_result", res)
						log_data("Join room result", socket.id, res)
					})
					.catch((error)=>{
						socket.join(room_id)
						socket.emit("join_result", res)
						socket.broadcast.to(room_id).emit("join_result", res)
						log_data("Join room result", socket.id, res)
					})					
				})
			})
			
		})
	}else{
		socket.emit("join_result", "invalid input")
		log_data("Join room result", socket.id, {"Error": "invalid input"})
	}
}

function create_component(socket, my_component_type, room_id){
	if (my_component_type in default_data){
		
		current_component_id = uuidv4()
		client.query("INSERT INTO app_content VALUES($1, $2, $3, $4, $5);", 
					[current_component_id, room_id, default_data["location"], default_data[my_component_type], my_component_type])
		
		if (my_component_type == "image"){
			var read_stream = fs.createReadStream(default_data["image"], {encoding: "binary"})
			read_stream.on("data", function(image_data){
				res = {
					component_id: current_component_id,
					component_type: my_component_type,
					component_data: image_data
				}
				socket.broadcast.to(room_id).emit("create_component", res)
				socket.emit("create_component", res)
				log_data("Create component result", socket.id, res)
			})
		}else{
			res = {
				component_id: current_component_id,
				component_type: my_component_type,
				component_data: default_data[my_component_type]
			}
			socket.broadcast.to(room_id).emit("create_component", res)
			socket.emit("create_component", res)
			log_data("Create component result", socket.id, res)
		}
	}
}	

function update_component(socket, room_id, current_component_id, current_component_type, update_type, current_update_info){
		// Handle update image

		res = {
			component_id: current_component_id,
			component_type: current_component_type,
			update_info: current_update_info
		}
		socket.broadcast.to(room_id).emit("update_component", res)

		if(update_type == "update_finished"){
			client.query("UPDATE app_content SET location=$1, data=$2 WHERE component_id=$3;", 
						[current_update_info.location, current_update_info.data, current_component_id])
		}
		log_data("Update component result", socket.id, res)
}

function delete_component(socket, my_component_id, room_id, my_component_type){
	
	client.query("DELETE FROM app_content WHERE component_id=$1;", [my_component_id])
	
	if (my_component_type == "image"){
		// TODO: How to delete image
	}
	res = {
		component_id: my_component_id,
		component_type: my_component_type
	}
	socket.broadcast.to(room_id).emit("delete_component", res)
	log_data("Delete component result", socket.id, res)
}

function remove_user(socket){
	current_room_id = ""
	res = {
		user_name: [],
		user_avatar: []
	}
	client.query("SELECT room_id FROM user_table WHERE user_id=$1;", [socket.id])
	.then((data)=>{
		if(typeof data.rows[0] !== "undefined"){
			current_room_id = data.rows[0].room_id
			client.query("DELETE FROM user_table WHERE user_id=$1;", [socket.id])
			.then(()=>{
				client.query("SELECT user_name, user_avatar FROM user_table WHERE room_id=$1;", [current_room_id])
				.then((data)=>{
					res.user_name = data.rows.map(o => o.user_name),
					res.user_avatar = data.rows.map(o => o.user_avatar)
					socket.broadcast.to(current_room_id).emit("remove_user", res)
					log_data("Remove user result", socket.id, res)
				})
			})
		}else{
			log_data("Remove user result", socket.id, res)
		}
		
	})	
}

function get_info(socket, room_id){
	res = {
		room_id: room_id,
		room_name: "",
		component : [],
		user_name: [], 
		user_avatar: []
	}
	client.query("SELECT * FROM app_content WHERE room_id=$1;", [room_id])
	.then((data) => {res.component = data.rows})
	.then(() => {
		client.query("SELECT user_name, user_avatar FROM user_table WHERE room_id=$1;", [room_id])
		.then((data) => {
			res.user_name = data.rows.map(o => o.user_name)
			res.user_avatar = data.rows.map(o => o.user_avatar)
		})
		.then(() => {
			client.query("SELECT room_name FROM room_table WHERE room_id=$1;", [room_id])
			.then((data) => {res.room_name = data.rows[0].room_name})
			.then(()=>{
				socket.emit("room_info", res)
				log_data("Get room info result", socket.id, res)
			})
		})
	})
}

function change_avatar(socket, user_avatar, room_id){
	client.query("UPDATE user_table SET user_avatar=$1 WHERE user_id=$2;", [user_avatar, socket.id])
	.then(()=>{
		res = {
			room_id: room_id,
			room_name: "",
			component : [],
			user_name: [], 
			user_avatar: []
		}
		client.query("SELECT * FROM app_content WHERE room_id=$1;", [room_id])
		.then((data) => {res.component = data.rows})
		.then(() => {
			client.query("SELECT user_name, user_avatar FROM user_table WHERE room_id=$1;", [room_id])
			.then((data) => {
				res.user_name = data.rows.map(o => o.user_name)
				res.user_avatar = data.rows.map(o => o.user_avatar)
			})
			.then(() => {
				client.query("SELECT room_name FROM room_table WHERE room_id=$1;", [room_id])
				.then((data) => {res.room_name = data.rows[0].room_name})
				.then(()=>{
					socket.emit("room_info", res)
					socket.broadcast.to(room_id).emit("room_info", res)
					log_data("Change avatar result", socket.id, res)
				})
			})
		})
	})

}

io.on("connection", function (socket) {
	socket.on("create", function(data) {
		log_data("Create room request", socket.id, data)
		create_room(socket, data.user_name, data.room_name, data.user_avatar)
	})

	socket.on("join", function(data) {
		log_data("Join room request", socket.id, data)
		join_room(socket, data.room_id, data.user_name, data.user_avatar)
	})

	socket.on("create_component", function (data) {
		log_data("Create component request", socket.id, data)
		create_component(socket, data.component_type, data.room_id)
	})

	socket.on("update_component", function (data) {
		log_data("Update component request", socket.id, data)
		update_component(socket, data.room_id, data.component_id, data.component_type, data.update_type, data.update_info)
	})

	socket.on("delete_component", function (data) {
		log_data("Delete component request", socket.id, data)
		delete_component(socket, data.component_id, data.room_id, data.component_type)
	})

	socket.on("get_info", function (data) {
		log_data("Get room info", socket.id, data)
		get_info(socket, data.room_id)
	})

	socket.on('change_avatar', function(data){
		log_data("Change avatar user request", socket.id, data)
		change_avatar(socket, data.user_avatar, data.room_id)
	});

	socket.on('disconnect', function(){
		log_data("Remove user request", socket.id, "N/A")
		remove_user(socket)
	});
})
