const { Server } = require('socket.io');
const io = new Server();
const socketApi = { io };

io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected. `);
    socket.on('join-room', (channelId) => {
        socket.join(channelId);
        console.log(`Socket ${socket.id} joined ${channelId}`);
    });
    socket.on('leave-room', (channelId) => {
        socket.leave(channelId);
        console.log(`Socket ${socket.id} left ${channelId}`);
    });
    socket.on('send-message', (message) => {
        io.in(message.channel).emit('message', message);
        console.log(`Socket ${socket.id} sent: "${message.text} to channel ${message.channel}"`);
    });
    socket.on('disconnect', (reason) => {
        console.log(reason);
    })
});

module.exports = socketApi;