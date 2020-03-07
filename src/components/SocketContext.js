import io from 'socket.io-client'

<<<<<<< HEAD
const socket = io ("http://ec2-50-112-33-65.us-west-2.compute.amazonaws.com:8084", {"transports": ["polling","websocket"]});
=======
const socket = io ("ec2-50-112-33-65.us-west-2.compute.amazonaws.com:8084", {"transports": ["polling","websocket"]});
>>>>>>> 11e308c0727fcc8bfe51a38653add43296d636e3

export default socket;