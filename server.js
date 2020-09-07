const Websocket = require('ws');
const uuid = require('uuid');

const PORT = process.env.PORT || 8080

// list of users
var CLIENTS=[];
var id;

const wss = new Websocket.Server({
  port: PORT
})

wss.on('connection', function connection(ws) {
  client_id = uuid();
  console.log(`Client with id: ${client_id} connected.`);
  CLIENTS[client_id] = ws;
  CLIENTS.push(ws);

  ws.on('message', function incoming(message) {
    message_parsed = JSON.parse(message)
    if (message_parsed.type === 'message') {
      if (message_parsed.private) {
        ws.send(message)
      }
      else {
        broadcast_msg(message)
      }
    }
    else if (message_parsed.type === 'join') {
      broadcast_msg(JSON.stringify({
        author: 'Server',
        content: `${message_parsed.username} joined the chat.`,
        id: uuid()
      }))
    }
    else if (message_parsed.type === 'leave') {
      broadcast_msg(JSON.stringify({
        author: 'Server',
        content: `${message_parsed.username} left the chat.`,
        id: uuid()
      }))
    }
  })
})

function broadcast_msg(message) {
  for (client of CLIENTS) {
    client.send(message);
  }
}

console.log(`Server running on ${PORT}`)
