var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

var index_path = '/home/ubuntu/team-A4/public/index.html'

app.get('/', function (req, res) {
  res.sendFile(index_path);
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});