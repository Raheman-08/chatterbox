const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path')
const moment = require('moment')

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.get('/', function (req, res, next) {
    return res.sendFile(path.join(__dirname+'/public/index.html'))
})
app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        let joinData = JSON.parse(data)
        socket.username = joinData.username;
        io.emit('message', JSON.stringify({ ...joinData, type: 'notify' }));
    });
    
    socket.on('chat message', (msg) => {
        let msgData = JSON.parse(msg)
        io.emit('message', JSON.stringify({ type: 'chat', username: socket.username, ...msgData }));
    });

    socket.on('disconnect', () => {
        io.emit('message', `${socket.username} has left the chat`);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
