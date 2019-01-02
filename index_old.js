var readline = require('readline')
util = require('util')
color = require("ansi-color").set
socketio = require('socket.io-client')

const socket = socketio.connect('http://localhost:3636')
const rl = readline.createInterface(process.stdin, process.stdout)
let nick = "Unknown"

function console_out(msg) {
	process.stdout.clearLine()
	process.stdout.cursorTo(0)
	console.log(msg)
	rl.prompt(true)
}

rl.question("Please enter a nickname: ", function(name) {
	nick = name
  var msg = nick + " has joined the chat"
	socket.emit('send', { type: 'notice', message: msg })
	rl.prompt(true)
})

rl.on('line', function (line) {
	if (line[0] == "/" && line.length > 1) {
		var cmd = line.match(/[a-z]+\b/)[0]
		var arg = line.substr(cmd.length+2, line.length)
	  chat_command(cmd, arg)
 
	} else {
		// send chat message
		socket.emit('send', { type: 'chat', message: line, nick: nick })
		rl.prompt(true)
	}
})

function chat_command(cmd, arg) {
	switch (cmd) {
 
		case 'nick':
			var notice = nick + " changed their name to " + arg
			nick = arg
			socket.emit('send', { type: 'notice', message: notice })
			break
 
		case 'msg':
			var to = arg.match(/[a-zA-Z]+\b/)[0]
			var message = arg.substr(to.length, arg.length)
			socket.emit('send', { type: 'tell', message: message, to: to, from: nick })
			rl.prompt(true)
			break
 
		case 'me':
			var emote = nick + " " + arg
			socket.emit('send', { type: 'emote', message: emote })
			break
 
		default:
			console_out("That is not a valid command.")
	}
}

socket.on('message', function (data) {
	let leader
	if (data.type == 'chat' && data.nick != nick) {
		leader = color("<"+data.nick+"> ", "green")
		console_out(leader + data.message)
	}
	else if (data.type == "notice") {
		console_out(color(data.message, 'cyan'))
	}
	else if (data.type == "tell" && data.to == nick) {
		leader = color("["+data.from+"->"+data.to+"]", "red")
		console_out(leader + data.message)
	}
	else if (data.type == "emote") {
		console_out(color(data.message, "cyan"))
	}
})
