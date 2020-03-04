var assert = require('assert');
var should = require('should');
var io = require('socket.io-client');


var room_uuid_obj = {room_id : "aa7b9618-e140-4262-ae39-86323153b7e8"}
var componet_obj = {component_id : "aa7b9618-e140-4262-ae39-86323153b7e8"}

var socketURL = 'http://ec2-54-184-200-244.us-west-2.compute.amazonaws.com:8082'
var options ={
	transports: ['polling','websocket'],
	'force new connection': false
  };

var client1, client2

default_data = {
	"text" : "Enter text here",
	"web"  : "http://ec2-54-184-200-244.us-west-2.compute.amazonaws.com"
	// "image": "images/default_image.jpg"
}

describe('Socket Connection', function(){
	beforeEach(function(done){
		client1 = io.connect(socketURL, options)
		client2 = io.connect(socketURL, options)
		done()
	});

	afterEach(function(done){
		client1.disconnect()
		client2.disconnect()
		done()
	})


	it('Test connect', function(done){
		done()
	})

	it('Disconnect', function(done){
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
					console.log("remove_user"),
					console.log(user_list),
					done()
				})
				
			})

		})

		
		
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
			component_info.component_id.should.not.be.empty(),
			component_info.component_data.should.equal("Enter text here")
			done()
		})
	})

	it('Create Web Component', function(done){
		client2.emit('create_component', {
			"component_type": "web",
			"room_id": room_uuid_obj.room_id
		})
		client1.on('create_component', (component_info) =>{
			component_info.component_id.should.not.be.empty(),
			component_info.component_data.should.equal("http://ec2-54-184-200-244.us-west-2.compute.amazonaws.com")
			done()
		})
	})

	it('Create Image Component', function(done){
		client2.emit('create_component', {
			"component_type": "image",
			"room_id": room_uuid_obj.room_id
		})
		client1.on('create_component', (component_info) =>{
			component_info.component_id.should.not.be.empty(),
			component_info.component_data.should.not.be.empty()
			done()
		})
	})

	it('Update Text Component', function(done){
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

	it('Update Web Component', function(done){
		client2.emit('create_component', {
			"component_type": "web",
			"room_id": room_uuid_obj.room_id
		})
		client1.on('create_component', (component_info) =>{
			component_info.component_id.should.not.be.empty(),
			component_info.component_data.should.equal("http://ec2-54-184-200-244.us-west-2.compute.amazonaws.com"),
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
			client1.on('delete_component', (component_id) => {
				component_id.should.equal(componet_obj.component_id),
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
			client1.on('delete_component', (component_id) => {
				component_id.should.equal(componet_obj.component_id),
				done()
			})
		})
		
	})


})