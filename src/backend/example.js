// JavaScript socket.io code

import io from "socket.io-client";

//Connection
const socket = io( "ec2-54-184-200-244.us-west-2.compute.amazonaws.com:8080", {
  "transports": ["polling","websocket"]
});


// Emitters

/**
 * 1. create
 **/

// 1.1: 2/20/2020, 10:43:25 PM
socket.emit("create", 
   ""
);

/**
 * 2. join
 **/

// 2.1: 2/20/2020, 10:48:43 PM
socket.emit("join", 
   {
      "room_id": "3e11bb8b-ffea-4a40-b81b-635660994a88"
   }
);

/**
 * 3. create_component
 **/

// 3.1: 2/20/2020, 11:22:05 PM
socket.emit("create_component", 
   {
      "room_id": "3e11bb8b-ffea-4a40-b81b-635660994a88",
      "component_type": "text"
   }
);

/**
 * 4. update_component
 **/

// 4.1: 2/21/2020, 12:09:10 AM
socket.emit("update_component", 
   {
      "room_id": "3e11bb8b-ffea-4a40-b81b-635660994a88",
      "component_id": "2a2ede2a-7bfb-45dd-83b8-883d29829f31",
      "update_type": "update_finished",
      "update_info": {
         "location": "(50,50),(50,50)",
         "data": "I have been updated"
      }
   }
);

// 4.2: 2/21/2020, 12:13:20 AM
socket.emit("update_component", 
   {
      "room_id": "3e11bb8b-ffea-4a40-b81b-635660994a88",
      "component_id": "2a2ede2a-7bfb-45dd-83b8-883d29829f31",
      "update_type": "inprogress",
      "update_info": {
         "location": "(50,50),(50,50)",
         "data": "I have been updated"
      }
   }
);

/**
 * 5. delete_component
 **/

// 5.1: 2/21/2020, 12:12:44 AM
socket.emit("delete_component", 
   {
      "room_id": "3e11bb8b-ffea-4a40-b81b-635660994a88",
      "component_id": "2a2ede2a-7bfb-45dd-83b8-883d29829f31",
      "component_type": "text"
   }
);

// Listeners

socket.on("connect", (data) => {
  console.log("socket connected");
});

socket.on("create_success", (data) => {
  console.log(data)
});

socket.on("invalid_component", (data) => {
  console.log(data)
});

socket.on("create_component", (data) => {
  console.log(data)
});

socket.on("update_component", (data) => {
  console.log(data)
});

socket.on("disconnect", () => {
  console.log("socket disconnected");
});

// for more information: https://github.com/socketio/socket.io-client/blob/master/docs/API.md
