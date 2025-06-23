// Node server that handles Socket.IO connections
const express = require('express');
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const users = {};

// Serve static files from 'public' folder
app.use(express.static("public"));

io.on("connection", socket => {
    console.log("A user connected");

    socket.on("new-user-joined", name => {
        users[socket.id] = name;
        console.log("New user joined:", name);
        socket.broadcast.emit("user-joined", name);
    });

    socket.on("send", message => {
        socket.broadcast.emit("receive", {
            message: message,
            name: users[socket.id]
        });
    });

    socket.on("disconnect", message => {
            socket.broadcast.emit('left',users[socket.id]);
            delete users[socket.id];
            
        
    });
});

http.listen(8000, () => {
    console.log("Server running at http://localhost:8000");
});
