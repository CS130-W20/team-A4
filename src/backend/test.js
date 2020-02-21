import io from "socket.io-client";

//Connection
const socket = io( "ec2-54-184-200-244.us-west-2.compute.amazonaws.com:8080", {
    "transports": ["polling","websocket"]
});

var test_case = process.argv

switch(test_case){
    case create_room:
}