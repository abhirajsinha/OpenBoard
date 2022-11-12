const express = require("express"); // Access
const socket = require("socket.io");

const app = express(); //Initialized and server ready

app.use(express.static("UI"));

let port = process.env.PORT || 3000;
let server = app.listen(port, () => {
    console.log("Listening to port" + port);
})

let io = socket(server);

io.on("connection", (socket) => {
    console.log("Made socket connection");
    // Received data
    socket.on("onmousedown", (data) => {
        // data -> data from frontend
        // Now transfer data to all connected computers
        io.sockets.emit("onmousedown", data);
    })
    socket.on("onmousemove", (data) => {
        io.sockets.emit("onmousemove", data);
    })
    socket.on("redraw", (data) => {
        io.sockets.emit("redraw", data);
    })
})