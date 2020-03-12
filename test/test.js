var assert = require('assert');
var should = require('should');
var io = require('socket.io-client');
var fs = require("fs");
var uuidv4 = require("uuid/v4");
// var { Client } = require("pg")

// db_config = {
// 	user: "dbuser" + dev_environment,
// 	password: "1234",
// 	database: "devdb" + dev_environment
// }



var room_uuid_obj = {room_id : "aa7b9618-e140-4262-ae39-86323153b7e8"}
var componet_obj = {component_id : "aa7b9618-e140-4262-ae39-86323153b7e8"}


var socketURL = 'http://ec2-50-112-33-65.us-west-2.compute.amazonaws.com:8082'
var options ={
	transports: ['polling','websocket'],
	'force new connection': false
  };

var client1, client2
var EXPECTED_TIMEOUT = 2000;

default_data = {
	"text" : "Enter text here",
	"web"  : "http://ec2-54-184-200-244.us-west-2.compute.amazonaws.com",
	"image": "/home/lys/team-A4/backend/images/default_image.jpg",
	"video": "https://youtu.be/zF9PdMVteOQ",
	"whiteboard": "default whiteboard",
	"location": "300,400,100,100"
}

describe('Socket Connection', function(){
	beforeEach(function(done){
		done()
	});

	afterEach(function(done){
		done()
	})


	it('Test connect/disconnect', function(done){
		client1 = io.connect(socketURL, options)
		client1.id.should.not.be.empty()
		client1.disconnect()
		done()
	})

	
})

describe('Basic Room Operation', function(){
	beforeEach(function(done){
		client1 = io.connect(socketURL, options)
		client2 = io.connect(socketURL, options)
		done()
	});

	afterEach(function(done) {
		client1.disconnect()
		client2.disconnect()
		//console.log(client1)
		done()
	});

	

	it('Create Room', function(done){
		//var client1 = io.connect(socketURL, options);
		//console.log(client1)
		client1.emit("create", {
			"user_name": "UnitTesterCreate", 
			"room_name": "UnitTestRoomCreateRoom"
		});
		client1.on("create_result", (room_info) =>{
			//console.log(room_info),
			room_info.room_name.should.equal("UnitTestRoomCreateRoom"),
			room_info.room_id.should.not.be.empty(),
			done()		
		})
		// TODO: Delete Room 
	})

	it('Join Room', function(done){
		client1.emit("create", {
			"user_name": "UnitTesterJoin", 
			"room_name": "UnitTestRoomJoinRoom"
		});
		client1.on("create_result", (room_info) =>{
			room_info.room_name.should.equal("UnitTestRoomJoinRoom"),
			room_info.room_id.should.not.be.empty(),
			room_uuid_obj.room_id = room_info.room_id,
			client2.emit("join", {
				"user_name": "UnitTesterJoin2", 
				"room_id": room_uuid_obj.room_id
			})
			client2.on("join_result", (room_info) =>{
				room_info.should.not.equal("invalid input"),
				done()
			})
		})
		// TODO: Delete Room 

	})

	it('Second User Leave Room', function(done){
		client1.emit("create", {
			"user_name": "UnitTesterDisconnect", 
			"room_name": "UnitTestRoomDisconnectRoom"
		})

		client1.on("create_result", (room_info) =>{
			room_info.room_name.should.equal("UnitTestRoomDisconnectRoom"),
			room_info.room_id.should.not.be.empty(), 
			room_uuid_obj.room_id = room_info.room_id,
			//console.log(room_uuid_obj.room_id)	
			//console.log("create room success "),
			client2.emit("join", {
				"user_name": "UnitTesterJoin3", 
				"room_id": room_uuid_obj.room_id
			}),
			client2.on("join_result", (room_info) =>{
				//console.log("join_result"),
				//console.log(room_info),
				room_info.should.not.equal("invalid input"),
				client2.disconnect(),
				client1.on('remove_user', (user_list) => {
					user_list.should.not.be.empty(),
					// console.log("remove_user"),
					// console.log(user_list),
					done()
				})
			})

		})
	})
})

describe('Basci Compoent Operation', function(){
	beforeEach(function(done){
		client1 = io.connect(socketURL, options)
		client2 = io.connect(socketURL, options)
		client1.emit("create", {
			"user_name": "UnitTesterCreate", 
			"room_name": "UnitTestRoomCreateComponent"
		});
		client1.on("create_result", (room_info) =>{
			room_info.room_name.should.equal("UnitTestRoomCreateComponent"),
			room_info.room_id.should.not.be.empty(),
			room_uuid_obj.room_id = room_info.room_id,
			client2.emit("join", {
				"user_name": "UnitTesterJoin", 
				"room_id": room_uuid_obj.room_id
			})
			done()	
		})
		
	});

	afterEach(function(done) {
		client1.disconnect()
		client2.disconnect()
		//console.log(client1)
		// TODO: Delete Room
		done()
	});

	it('Create Text Component', function(done){
		client2.emit('create_component', {
			"component_type": "text",
			"room_id": room_uuid_obj.room_id
		})
		client1.on('create_component', (component_info) =>{

			component_info.component_type.should.equal("text"),
			component_info.component_id.should.not.be.empty(),
			component_info.component_data.should.equal(default_data["text"])
			done()
		})
	})

	it('Create Web Component', function(done){
		client2.emit('create_component', {
			"component_type": "web",
			"room_id": room_uuid_obj.room_id
		})
		client1.on('create_component', (component_info) =>{
			component_info.component_type.should.equal("web"),
			component_info.component_id.should.not.be.empty(),
			component_info.component_data.should.equal(default_data["web"])
			done()
		})
	})

	it('Create Image Component', function(done){
		client2.emit('create_component', {
			"component_type": "image",
			"room_id": room_uuid_obj.room_id
		})

		var read_stream = fs.createReadStream(default_data["image"], {encoding: "binary"})
		
		client1.on('create_component', (component_info) =>{
			component_info.component_id.should.not.be.empty(),
			component_info.component_data.should.not.be.empty(),
			component_info.component_type.should.equal("image"),
			read_stream.on("data", function(image_data){
				component_info.component_data.should.equal(image_data),
				done()
			})
		})
	})

	it('Create Video Component', function(done){
		client2.emit('create_component', {
			"component_type": "video",
			"room_id": room_uuid_obj.room_id
		})
		client1.on('create_component', (component_info) =>{
			component_info.component_type.should.equal("video"),
			component_info.component_id.should.not.be.empty(),
			component_info.component_data.should.equal(default_data["video"])
			done()
		})
	})


	it('Create Whiteboard Component', function(done){
		client2.emit('create_component', {
			"component_type": "whiteboard",
			"room_id": room_uuid_obj.room_id
		})
		client1.on('create_component', (component_info) =>{
			component_info.component_type.should.equal("whiteboard"),
			component_info.component_id.should.not.be.empty(),
			component_info.component_data.should.equal(default_data["whiteboard"])
			done()
		})
	})

	it('Update Text Component in_progress', function(done){
		client2.emit('create_component', {
			"component_type": "text",
			"room_id": room_uuid_obj.room_id
		})
		client1.on('create_component', (component_info) =>{
			component_info.component_id.should.not.be.empty(),
			component_info.component_data.should.equal("Enter text here"),
			componet_obj.component_id = component_info.component_id,
			client2.emit('update_component', {
				"room_id": room_uuid_obj.room_id,
				"component_id": componet_obj.component_id,
				"update_type": "update_inprogess",
				"update_info": "Text component has been updated (Update Text Component)"
			})
			client1.on('update_component', (component_info) => {
				component_info.component_id.should.equal(componet_obj.component_id),
				component_info.update_info.should.equal("Text component has been updated (Update Text Component)"),
				done()
			})
		})	
	})

	it('Update Text Component update_finished', function(done){
		client2.emit('create_component', {
			"component_type": "text",
			"room_id": room_uuid_obj.room_id
		})
		client1.on('create_component', (component_info) =>{
			component_info.component_id.should.not.be.empty(),
			component_info.component_data.should.equal("Enter text here"),
			componet_obj.component_id = component_info.component_id,
			client2.emit('update_component', {
				"room_id": room_uuid_obj.room_id,
				"component_id": componet_obj.component_id,
				"update_type": "update_finished",
				"update_info": "Text component has been updated (Update Text Component)"
			})
			client1.on('update_component', (component_info) => {
				component_info.component_id.should.equal(componet_obj.component_id),
				component_info.update_info.should.equal("Text component has been updated (Update Text Component)"),
				done()
			})
		})	
	})

	it('Update Web Component', function(done){
		client2.emit('create_component', {
			"component_type": "web",
			"room_id": room_uuid_obj.room_id
		})
		client1.on('create_component', (component_info) =>{
			component_info.component_id.should.not.be.empty(),
			component_info.component_data.should.equal(default_data["web"]),
			componet_obj.component_id = component_info.component_id,
			client2.emit('update_component', {
				"room_id": room_uuid_obj.room_id,
				"component_id": componet_obj.component_id,
				"update_type": "update_inprogess",
				"update_info": "www.bilibili.com"
			})
			client1.on('update_component', (component_info) => {
				component_info.component_id.should.equal(componet_obj.component_id),
				component_info.update_info.should.equal("www.bilibili.com"),
				done()
			})
		})
	})

	it('Update Image Component', function(done){

		//====================================================================
		//|          HAS BEEN MOVED TO WHITEBOARD FUNCTION                   |
		//====================================================================

		// TODO: Maybe it will be same as whiteboard 
		done()
		// client2.emit('create_component', {
		// 	"component_type": "text",
		// 	"room_id": room_uuid_obj.room_id
		// })
		// client1.on('create_component', (component_info) =>{
		// 	component_info.component_id.should.not.be.empty(),
		// 	component_info.component_data.should.equal("Enter text here"),
		// 	componet_obj.component_id = component_info.component_id,
		// 	client2.emit('update_component', {
		// 		"room_id": room_uuid_obj.room_id,
		// 		"component_id": componet_obj.component_id,
		// 		"update_type": "update_inprogess",
		// 		"update_info": "Text component has been updated (Update Text Component)"
		// 	})
		// 	client1.on('update_component', (component_info) => {
		// 		component_info.component_id.should.equal(componet_obj.component_id),
		// 		component_info.update_info.should.equal("Text component has been updated (Update Text Component)"),
		// 		done()
		// 	})
		// })	
	})

	it('Update Video Component', function(done){
		client2.emit('create_component', {
			"component_type": "video",
			"room_id": room_uuid_obj.room_id
		})
		client1.on('create_component', (component_info) =>{
			component_info.component_id.should.not.be.empty(),
			component_info.component_data.should.equal(default_data["video"]),
			componet_obj.component_id = component_info.component_id,
			client2.emit('update_component', {
				"room_id": room_uuid_obj.room_id,
				"component_id": componet_obj.component_id,
				"update_type": "update_inprogess",
				"update_info": "https://www.youtube.com/watch?v=2qq8dzKw41Y"
			})
			client1.on('update_component', (component_info) => {
				component_info.component_id.should.equal(componet_obj.component_id),
				component_info.update_info.should.equal("https://www.youtube.com/watch?v=2qq8dzKw41Y"),
				done()
			})
		})	
	})

	it('Update Whiteboard Component', function(done){
		client2.emit('create_component', {
			"component_type": "whiteboard",
			"room_id": room_uuid_obj.room_id
		})
		client1.on('create_component', (component_info) =>{
			component_info.component_id.should.not.be.empty(),
			component_info.component_data.should.equal(default_data["whiteboard"]),
			componet_obj.component_id = component_info.component_id,
			client2.emit('update_component', {
				"room_id": room_uuid_obj.room_id,
				"component_id": componet_obj.component_id,
				"update_type": "update_inprogess",
				"update_info": "{\"lines\":[{\"points\":[{\"x\":183.5754562850894,\"y\":113.78050055570638},{\"x\":183.5754562850894,\"y\":113.78050055570638},{\"x\":197.59320638322114,\"y\":105.84903731249238},{\"x\":211.5050850816909,\"y\":96.31007435155686},{\"x\":236.1091336472092,\"y\":80.7097448079849},{\"x\":266.8462277157663,\"y\":62.2833893449901},{\"x\":281.83698884279994,\"y\":55.3728743991192},{\"x\":314.29595697712847,\"y\":43.08228597266247},{\"x\":345.54473150654513,\"y\":35.636003434811286},{\"x\":356.22776869898706,\"y\":34.00979557100535},{\"x\":365.10853764121373,\"y\":33.080799180360636},{\"x\":381.03352624699374,\"y\":32.15755167077434},{\"x\":384.0253551190156,\"y\":32.00675810330182},{\"x\":392.0129389637246,\"y\":31.719299056165546},{\"x\":396.00898611820503,\"y\":31.59946974726172},{\"x\":400.00624071037504,\"y\":31.499589299861068}],\"brushColor\":\"#000000\",\"brushRadius\":4}],\"width\":400,\"height\":400}"
			})
			client1.on('update_component', (component_info) => {
				component_info.component_id.should.equal(componet_obj.component_id),
				component_info.update_info.should.equal("{\"lines\":[{\"points\":[{\"x\":183.5754562850894,\"y\":113.78050055570638},{\"x\":183.5754562850894,\"y\":113.78050055570638},{\"x\":197.59320638322114,\"y\":105.84903731249238},{\"x\":211.5050850816909,\"y\":96.31007435155686},{\"x\":236.1091336472092,\"y\":80.7097448079849},{\"x\":266.8462277157663,\"y\":62.2833893449901},{\"x\":281.83698884279994,\"y\":55.3728743991192},{\"x\":314.29595697712847,\"y\":43.08228597266247},{\"x\":345.54473150654513,\"y\":35.636003434811286},{\"x\":356.22776869898706,\"y\":34.00979557100535},{\"x\":365.10853764121373,\"y\":33.080799180360636},{\"x\":381.03352624699374,\"y\":32.15755167077434},{\"x\":384.0253551190156,\"y\":32.00675810330182},{\"x\":392.0129389637246,\"y\":31.719299056165546},{\"x\":396.00898611820503,\"y\":31.59946974726172},{\"x\":400.00624071037504,\"y\":31.499589299861068}],\"brushColor\":\"#000000\",\"brushRadius\":4}],\"width\":400,\"height\":400}"),
				done()
			})
		})	
	})

	it('Delete Text Component', function(done){
		client2.emit('create_component', {
			"component_type": "text",
			"room_id": room_uuid_obj.room_id
		})
		client1.on('create_component', (component_info) =>{
			component_info.component_id.should.not.be.empty(),
			component_info.component_data.should.equal("Enter text here"),
			componet_obj.component_id = component_info.component_id,
			client2.emit('delete_component', {
				"room_id": room_uuid_obj.room_id,
				"component_id": componet_obj.component_id,
				"component_type": "text"
			})
			client1.on('delete_component', (return_info) => {
				return_info.component_id.should.equal(componet_obj.component_id),
				return_info.component_type.should.equal('text'),
				done()
			})
		})
		
	})

	it('Delete Web Component', function(done){
		client2.emit('create_component', {
			"component_type": "web",
			"room_id": room_uuid_obj.room_id
		})
		client1.on('create_component', (component_info) =>{
			component_info.component_id.should.not.be.empty(),
			component_info.component_data.should.equal("http://ec2-54-184-200-244.us-west-2.compute.amazonaws.com"),
			componet_obj.component_id = component_info.component_id,
			client2.emit('delete_component', {
				"room_id": room_uuid_obj.room_id,
				"component_id": componet_obj.component_id,
				"component_type": "web"
			})
			client1.on('delete_component', (return_info) => {
				return_info.component_id.should.equal(componet_obj.component_id),
				return_info.component_type.should.equal('web'),
				done()
			})
		})
	})

	it('Delete Image Component', function(done){

		//====================================================================
		//|          HAS BEEN MOVED TO WHITEBOARD FUNCTION                   |
		//====================================================================

		// TODO: 
		done()
		// client2.emit('create_component', {
		// 	"component_type": "image",
		// 	"room_id": room_uuid_obj.room_id
		// })
		// client1.on('create_component', (component_info) =>{
		// 	component_info.component_id.should.not.be.empty(),
		// 	component_info.component_data.should.equal("Enter text here"),
		// 	componet_obj.component_id = component_info.component_id,
		// 	client2.emit('delete_component', {
		// 		"room_id": room_uuid_obj.room_id,
		// 		"component_id": componet_obj.component_id,
		// 		"component_type": "text"
		// 	})
		// 	client1.on('delete_component', (return_info) => {
		// 		return_info.component_id.should.equal(componet_obj.component_id),
		// 		return_info.component_type.should.equal('text'),
		// 		done()
		// 	})
		// })
	})

	it('Delete Video Component', function(done){
		client2.emit('create_component', {
			"component_type": "video",
			"room_id": room_uuid_obj.room_id
		})
		client1.on('create_component', (component_info) =>{
			component_info.component_id.should.not.be.empty(),
			component_info.component_data.should.equal(default_data["video"]),
			componet_obj.component_id = component_info.component_id,
			client2.emit('delete_component', {
				"room_id": room_uuid_obj.room_id,
				"component_id": componet_obj.component_id,
				"component_type": "video"
			})
			client1.on('delete_component', (return_info) => {
				return_info.component_id.should.equal(componet_obj.component_id),
				return_info.component_type.should.equal('video'),
				done()
			})
		})
	})

	it('Delete Whiteboard Component', function(done){
		client2.emit('create_component', {
			"component_type": "whiteboard",
			"room_id": room_uuid_obj.room_id
		})
		client1.on('create_component', (component_info) =>{
			component_info.component_id.should.not.be.empty(),
			component_info.component_data.should.equal(default_data["whiteboard"]),
			componet_obj.component_id = component_info.component_id,
			client2.emit('delete_component', {
				"room_id": room_uuid_obj.room_id,
				"component_id": componet_obj.component_id,
				"component_type": "whiteboard"
			})
			client1.on('delete_component', (return_info) => {
				return_info.component_id.should.equal(componet_obj.component_id),
				return_info.component_type.should.equal('whiteboard'),
				done()
			})
		})
	})
})

describe('Complex Room Operation', function(){
	beforeEach(function(done){
		client1 = io.connect(socketURL, options)
		client2 = io.connect(socketURL, options)
		done()
	});

	afterEach(function(done) {
		client1.disconnect()
		client2.disconnect()
		//console.log(client1)
		done()
	});

	it('Refresh Room with single user', function(done) {
		client1.emit("create", {
			"user_name": "UnitTesterRefresh", 
			"room_name": "UnitTestRoomRefreshRoom"
		})

		client1.on("create_result", (room_info) =>{
			room_info.room_name.should.equal("UnitTestRoomRefreshRoom"),
			room_info.room_id.should.not.be.empty(), 
			room_uuid_obj.room_id = room_info.room_id,
			client1.emit("join", {
				"user_name": "UnitTesterRefresh", 
				"room_id": room_uuid_obj.room_id
			}),
			client1.on("join_result", (room_info) =>{
				room_info.should.not.equal("invalid input"),
				done()			
			})

		})
	})

	it('Refresh Room with multiple users', function(done) {
		client1.emit("create", {
			"user_name": "UnitTesterRefresh", 
			"room_name": "UnitTestRoomRefreshRoom"
		})

		client1.on("create_result", (room_info) =>{
			room_info.room_name.should.equal("UnitTestRoomRefreshRoom"),
			room_info.room_id.should.not.be.empty(), 
			room_uuid_obj.room_id = room_info.room_id,
			client2.emit("join", {
				"user_name": "UnitTesterRefresh2", 
				"room_id": room_uuid_obj.room_id
			}),
			client2.on("join_result", (room_info) =>{
				room_info.should.not.equal("invalid input"),
				client1.emit("join", {
					"user_name": "UnitTesterRefresh", 
					"room_id": room_uuid_obj.room_id
				}),
				client1.on("join_result", (room_info) =>{
					room_info.should.not.equal("invalid input"),
					done()			
				})	
			})
		})
	})

	it('Join Nonexist Room', function(done){
		this.timeout(EXPECTED_TIMEOUT + 100); // You add this to make sure mocha test timeout will only happen as a fail-over, when either of the functions haven't called done callback.
  		var timeout = setTimeout(done, EXPECTED_TIMEOUT); // This will call done when timeout is reached.
		client1.emit("create", {
			"user_name": "UnitTesterJoin", 
			"room_name": "UnitTestRoomJoinRoom"
		});
		client1.on("create_result", (room_info) =>{
			room_info.room_name.should.equal("UnitTestRoomJoinRoom"),
			room_info.room_id.should.not.be.empty(),
			room_uuid_obj.room_id = room_info.room_id,
			current_room_id = uuidv4(),
			client2.emit("join", {
				"user_name": "UnitTesterJoin2", 
				"room_id": current_room_id
			})
			client2.on("join_result", (room_info) =>{
				clearTimeout(timeout);
				// this should never happen, is the expected behavior.
				done(new Error('Unexpected call'));
			})
		})
	})

	it('Create Room with Invalid Room Name 1', function(done){
		client1.emit("create", {
			"user_name": "UnitTester_Join", 
			"room_name": "UnitTestRoomInvalidRoom&D*(VNZX)ASDYF"
		});
		client1.on("create_result", (room_info) => {
			room_info.should.equal("invalid input")
			done()
		})
	})

	it('Create Room with Invalid User Name 1', function(done){
		client1.emit("create", {
			"user_name": "a9872q30984 6hrta89ywdsgiuoyatbgf87258397fta897swd*& V%(%(&*^FSD*YVBC*(YRTA", 
			"room_name": "UnitTestRoomInvalidRoom"
		});
		client1.on("create_result", (room_info) => {
			room_info.should.equal("invalid input")
			done()
		})
	})

	it('Create Room with Invalid User Name 2', function(done){
		client1.emit("create", {
			"user_name": "UnitTester_Join", 
			"room_name": "UnitTestRoomInvalidRoom"
		});
		client1.on("create_result", (room_info) => {
			room_info.should.equal("invalid input")
			done()
		})
	})


	it('Join Room with Invalid User Name', function(done){
		client1.emit("create", {
			"user_name": "UnitTesterJoin", 
			"room_name": "UnitTestRoomJoinRoom"
		});
		client1.on("create_result", (room_info) =>{
			room_info.room_name.should.equal("UnitTestRoomJoinRoom"),
			room_info.room_id.should.not.be.empty(),
			room_uuid_obj.room_id = room_info.room_id,
			client2.emit("join", {
				"user_name": "UnitTesterJoinInvalidSD*&FTY)*SDG", 
				"room_id": room_uuid_obj.room_id
			})
			client2.on("join_result", (room_info) =>{
				room_info.should.equal("invalid input")
				done()
			})
		})
	})


})