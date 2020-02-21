import io from "socket.io-client";

//Connection
const socket = io( "ec2-54-184-200-244.us-west-2.compute.amazonaws.com:8080", {
    "transports": ["polling","websocket"]
});

var test_case = process.argv[2]

switch(test_case){
    case "create_room":
        break;
    case "join_room":
        break;
    case "create_component":
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
        console.log("Please input a valid test case. You can choose from 'create_room', 'join_room', \
        'create_component', 'update_component_inprogress', 'update_component_update_finish'\
        'delete_component', 'all'")
}

function create_room(socket){}

function join_room(socket){}

function join_room(socket){}