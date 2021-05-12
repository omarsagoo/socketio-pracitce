const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

connectedMap = {}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
    const _id = socket.id

    io.emit('chat message', {msg: "A user has connected", name: "Admin"})
    
    socket.on("typing", (name) => {
        io.emit('typing', name)
    })

    socket.on('done typing', () => {
        io.emit('done typing', 'done');
    })

    socket.on('connected', (name) => {
        connectedMap[_id] = name
        io.emit('connected', connectedMap);
    })

    socket.on('disconnect', () => {
        io.emit('chat message', {msg: `${connectedMap[_id]} has disconnected`, name: "Admin"});

        delete connectedMap[_id]
        
        io.emit('connected', connectedMap)
    })

    socket.on('chat message', (data) => {
      io.emit('chat message', data);
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});