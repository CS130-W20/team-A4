import io from 'socket.io-client'

const socket = io ("http://ec2-50-112-33-65.us-west-2.compute.amazonaws.com:8084", {"transports": ["polling","websocket"]});

export default socket;