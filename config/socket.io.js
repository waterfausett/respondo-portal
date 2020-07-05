const socket = require("socket.io");

module.exports = (server) => {
    const io = socket(server);

    io.on('connection', (socket) => {
        console.log('Connected');
    
        socket.on("trigger added", (data) => {
            socket.to(data.guildId).emit("trigger added", data);
        });
    
        socket.on("trigger updated", (data) => {
            socket.to(data.guildId).emit("trigger updated", data);
        });
    
        socket.on("trigger deleted", (data) => {
            socket.to(data.guildId).emit("trigger deleted", data);
        });
    
        socket.on('change guild', (guildId) => {
            socket.leaveAll();
    
            if (guildId)
                socket.join(guildId);
        });
    
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};