var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var uuidv4 = require('uuid/v4')
var { Client } = require('pg')

db_config = {
	user: 'dbuser',
	password: '1234',
	database: 'devdb'
}

var create_text_table = "CREATE TABLE IF NOT EXISTS text_table (\
							component_id UUID PRIMARY KEY, \
							room_id UUID NOT NULL, \
							location BOX NOT NULL, \
							content TEXT \
						);"

var create_web_table = "CREATE TABLE IF NOT EXISTS web_table (\
							component_id UUID PRIMARY KEY, \
							room_id UUID NOT NULL, \
							location BOX NOT NULL, \
							link VARCHAR \
						);"
						
var create_text_component = "INSERT INTO text_table VALUES($1, $2, '((0, 0), (100, 100))', 'Enter text here');"
var create_web_component = "INSERT INTO web_table VALUES($1, $2, '((0, 0), (100, 100))', 'http://ec2-54-184-200-244.us-west-2.compute.amazonaws.com');"

var client = new Client(db_config)
client.connect()
client.query(create_text_table)
client.query(create_web_table)

var index_path = '/home/ubuntu/team-A4/public/index.html'
server.listen(80)

app.get('/', function (req, res) {
    res.sendFile(index_path)
})

app.post('/create_room', function (req, res) {
    current_uuid = uuidv4()
    res.send({uuid: current_uuid})
})

app.post('/create_component', function (req, res) {
	component_queries = {
		'text' : create_text_component,
		'web'  : create_web_component
	}
	if (req.query.component_type in component_queries){
		current_component_id = uuidv4()
		client.query(component_queries[req.query.component_type], [current_component_id, req.query.room_id])
		res.send({component_id: current_component_id})
	}else{
		console.error("ERROR: Unrecognized component type")
		res.send("Please send valid request")
	}	
})

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' })
    socket.on('my other event', function (data) {
        console.log(data)
    })
})