var readline = require('readline')
util = require('util')
color = require("ansi-color").set
stellarChat = require('./stellar')

const rl = readline.createInterface(process.stdin, process.stdout)
let nick = "Unknown"
let knownNicks = {}

function console_out(msg) {
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  console.log(msg)
  rl.prompt(true)
}

/*rl.question("Please enter a nickname: ", function(name) {
  nick = name
  stellarChat.emit({ msgType: 'n', msgContent: nick })
  rl.prompt(true)
})*/

rl.on('line', function (line) {
  if (line[0] == "/" && line.length > 1) {
    var cmd = line.match(/[a-z]+\b/)[0]
    var arg = line.substr(cmd.length+2, line.length)
    chat_command(cmd, arg)
 
  } else {
    // send chat message
    stellarChat.emit({ msgType: 'c', msgContent: line.slice(0, 27) })
    rl.prompt(true)
  }
})

function chat_command(cmd, arg) {
  switch (cmd) {
 
    case 'nick':
      nick = arg
      stellarChat.emit({ msgType: 'n', msgContent: nick })
      break
 
    /*case 'msg':
      var to = arg.match(/[a-zA-Z]+\b/)[0]
      var message = arg.substr(to.length, arg.length)
      socket.emit('send', { type: 'tell', message: message, to: to, from: nick })
      rl.prompt(true)
      break*/
 
    /*case 'me':
      var emote = nick + " " + arg
      socket.emit('send', { type: 'emote', message: emote })
      break*/
 
    default:
      console_out("That is not a valid command.")
  }
}

stellarChat.onTx(function (tx) {
  if (tx.memo_type === 'text') {
    memo = tx.memo
    if (!memo || memo.length < 2) {
      return//throw Error(`malformed memo: ${memo}`)
    }
    switch (tx.memo[0]) {
      case 'n':
        knownNicks[tx.source_account] = memo.slice(1)
        break
      case 'c':
        console_out(`<${knownNicks[tx.source_account] || 'Unknown'}> ${memo.slice(1)}`)
        break
    }
  }
})
