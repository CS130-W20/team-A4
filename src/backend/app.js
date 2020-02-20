var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var uuidv4 = require('uuid/v4')
var { Client } = require('pg')
var client = new Client()

var create_text_table = "CREATE TABLE text_table (\
                            component_id INT PRIMARY KEY, \
                            room_id VARCHAR NOT NULL\
                            location BOX NOT NULL, \
                            content TEXT \
                        );"

await client.connect()
await client.query(create_text_table)

server.listen(80)

var index_path = '/home/ubuntu/team-A4/public/index.html'

app.get('/', function (req, res) {
    res.sendFile(index_path)
})

app.post('/create_room', function (req, res) {
    current_uuid = uuidv4()
    res.send({uuid: current_uuid})
})


io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' })
    socket.on('my other event', function (data) {
        console.log(data)
    })
})