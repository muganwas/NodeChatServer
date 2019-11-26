const port = process.env.PORT || 4000;
const io = require('socket.io')(port);
var users = {};
io.on("connection", socket=>{
    const id = socket.id;
    socket.emit('join-alert', 'You Joined');
    socket.on('send-chat-message', message => {
        let name = users[id];
        const data = { name, message };
        socket.broadcast.emit('chat-message', data);
    });

    socket.on('user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    });

    socket.on("disconnect", ()=>{
        let name = users[id];
        socket.broadcast.emit('user-disconnected', name);
        delete users[id];
    })
});