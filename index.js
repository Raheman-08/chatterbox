const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path')

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.get('/', function (req, res, next) {
    return res.sendFile(path.join(__dirname+'/public/index.html'))
})
app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.on('join', (username) => {
        console.log('Username => ', username);
        socket.username = username;
        io.emit('message', `${username} has joined the chat`);
    });
    
    socket.on('chat message', (msg) => {
        console.log('msg => ', msg);
        io.emit('message', `${socket.username}: ${msg}`);
    });

    socket.on('disconnect', () => {
        io.emit('message', `${socket.username} has left the chat`);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});