import io from 'socket.io-client'

const socket = io ("http://ec2-50-112-33-65.us-west-2.compute.amazonaws.com:8084", {"transports": ["polling","websocket"]});

export default socket;

//module.exports = io ("ec2-54-184-200-244.us-west-2.compute.amazonaws.com:8080", {"transports": ["polling","websocket"]});
