var assert = require('assert');
var should = require('should');
var io = require('socket.io-client');


var room_uuid_obj = {room_id : "aa7b9618-e140-4262-ae39-86323153b7e8"}

var socketURL = 'http://ec2-54-184-200-244.us-west-2.compute.amazonaws.com:8080'
var options ={
	transports: ['polling','websocket']
	//'force new connection': false
  };

var client1, client2

default_data = {
	"text" : "Enter text here",
	"web"  : "http://ec2-54-184-200-244.us-west-2.compute.amazonaws.com"
	// "image": "images/default_image.jpg"
}

describe('Socket Connection', function(){
	it('Test connect', function(done){
		// client1 = io.connect(socketURL, options),
		// console.log(client1.id),
		// client1.disconnect()
		// done()
	})
})

describe('Room Operation', function(){
	beforeEach(function(done){
		client1 = io.connect(socketURL, options)
		done()
	});

	afterEach(function(done) {
		client1.disconnect()
		//console.log(client1)
		done()
	});

	

	it('Create Room', function(done){
		//var client1 = io.connect(socketURL, options);
		//console.log(client1)
		client1.emit("create", {
			"user_name": "Dad", 
			"room_name": "TestRoom1234"
		});
		client1.on("create_result", (room_info) =>{
			room_info.room_name.should.equal("TestRoom1234"),
			room_info.room_id.should.not.be.empty(),
			done()		
		})
	})

	// it('Join Room', function(){
	// 	client1.emit("join", {
	// 		"user_name": "Dad", 
	// 		"room_id": room_uuid_obj
	// 	})
	// })


})