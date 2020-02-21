import io from "socket.io-client";

//Connection
const socket_1 = io( "ec2-54-184-200-244.us-west-2.compute.amazonaws.com:8080", {
    "transports": ["polling","websocket"]
});
const socket_2 = io( "ec2-54-184-200-244.us-west-2.compute.amazonaws.com:8080", {
    "transports": ["polling","websocket"]
  });

var test_case = process.argv[2]
var room_uuid_obj = {room_id = "3e11bb8b-ffea-4a40-b81b-635660994a88"}

default_data = {
	"text" : "Enter text here",
	"web"  : "http://ec2-54-184-200-244.us-west-2.compute.amazonaws.com"
	// "image": "images/default_image.jpg"
}

switch(test_case){
    case "create_room":
        console.log(create_room(room_uuid_obj))
        break;
    case "join_good_room":
        console.log(join_good_room(room_uuid_obj))
        break;
    case "join_bad_room":
        console.log(join_bad_room(room_uuid_obj))
        break;
    case "create_text_component":
        break;
    case "create_text_component":
        break;
    case "update_component_inprogress":
        break;
    case "update_component_update_finish":
        break;
    case "delete_component":
        break;
    case "all":
        break;
    default:
        console.log("Please input a valid test case. You can choose from 'create_room', 'join_good_room', \
        'join_bad_room','create_component', 'update_component_inprogress', 'update_component_update_finish'\
        'delete_component', 'all'")
}

function create_room(room_uuid_obj){
    socket_1.emit("create", {"user_name": "Dad Terry"});
    socket_1.on("create_success", (data) => {
        if(data === "") {
            return("FAILED: create_room")
        }
        room_uuid_obj.room_id = data
    });
    return("SUCCESSED: create_room")
}

function join_good_room(room_uuid_obj){
    create_room(room_uuid_obj);
    socket_1.emit("join", 
    {
        "room_id": room_uuid_obj.room_id
    })
    socket_1.on("join_result", (data) => {
        return("SUCCESSED: join_good_room")
    });
    return("FAILED: join_good_room")
}
function join_bad_room(room_uuid_obj){
    create_room(room_uuid_obj);
    socket_1.emit("join", 
    {
        "room_id": room_uuid_obj.room_id
    })
    socket_1.on("join_result", (data) => {
        if(data === "invalid room_id"){
            return("SUCCESSED: join_bad_room")
        }
    });
    return("FAILED: join_bad_room")
}

function create_text_component(room_uuid_obj){
    create_room(room_uuid_obj);
    socket_2.emit("join", 
    {
        "room_id": room_uuid_obj.room_id
    })
    socket_1.emit("create_component", 
    {
        "room_id": room_uuid_obj.room_id,
        "component_type": "text"
    });
    socket_2.on("create_component", (data) => {
        if(data.component_id != "" && data.component_data === default_data["web"]){
            return("SUCCESSED: create_text_component")
        }
    });
    return("FAILED: create_text_component")
}

function update_component(){}

function delete_component(){}

