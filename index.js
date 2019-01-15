require('dotenv').config()
const readline = require('readline')
const util = require('util')
const color = require("ansi-color").set
const _ = require('lodash')
const StellarChatDriver = require('./stellar-chat-driver')


const chatDriver = StellarChatDriver(
  process.env.NETWORK_PASSPHRASE,
  process.env.HORIZON_URL,
  process.env.CLIENT_SECRET,
)
const rl = readline.createInterface(process.stdin, process.stdout)
let knownNicks = {}

function console_out(msg) {
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  console.log(msg)
  rl.prompt(true)
}

rl.on('line', function (line) {
  if (line[0] == "/" && line.length > 1) {
    var cmd = line.match(/[a-z]+\b/)[0]
    var arg = line.substr(cmd.length+2, line.length)
    chat_command(cmd, arg)
 
  } else {
    // send chat message
    chat_command('chat', line)
    rl.prompt(true)
  }
})

function chat_command(cmd, arg) {
  let nick
  switch (cmd) {
 
    case 'nick':
      nick = arg
      chatDriver.emit({ type: 'n', content: nick })
      break
 
    case 'chat':
      nick = arg.match(/[a-zA-Z]+\b/)[0]
      const to = knownNicks[nick] ? knownNicks[nick].publicKey : undefined

      if (!to) {
        console_out(`Unknown receiver: ${nick}`)
        break
      }

      const message = arg.substr(1 + nick.length, arg.length)
      chatDriver.emit({ type: 'c', content: message.slice(0, 27), to })
      rl.prompt(true)
      break
 
    default:
      console_out("That is not a valid command.")
  }
}

chatDriver.onEvent(function (event) {
  switch (event.type) {
    case 'nick':
      knownNicks[event.content] = {
        nick: event.content,
        publicKey: event.source,
      }
      console_out(`${event.source} has nick ${event.content}`)
      break
    case 'chat':
      const nickRecord = _.find(Object.values(knownNicks), (elem) => elem.publicKey === event.source)

      console_out(`<${nickRecord ? nickRecord.nick : `Unknown (${event.source.slice(0, 5)}...)`}> ${event.content}`)
      break
  }
})
