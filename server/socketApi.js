const io = require( "socket.io" )();
const socketapi = {
    io: io
};
const onlineUsers = require("./onlineUsers");

// Add your socket.io logic here!
io.on("connection", (socket) => {
    socket.on("go-online", (id) => {
      if (!onlineUsers.hasOwnProperty(id)) {
        onlineUsers[id] = id;
      }
      // send the user who just went online to everyone else who is already online
      socket.broadcast.emit("add-online-user", id);
    });
  
    socket.on("new-message", (data) => {
      socket.broadcast.emit("new-message", {
        message: data.message,
        sender: data.sender,
      });
    });
  
    socket.on("logout", (id) => {
      if (onlineUsers.hasOwnProperty(id)) {
        delete onlineUsers[id];
        socket.broadcast.emit("remove-offline-user", id);
      }
    });
  });
// end of socket.io logic

module.exports = socketapi;