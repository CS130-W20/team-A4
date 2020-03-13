import io from 'socket.io-client'

const socket = io ("http://ec2-54-212-210-30.us-west-2.compute.amazonaws.com:8080", {"transports": ["polling","websocket"]});

export default socket;