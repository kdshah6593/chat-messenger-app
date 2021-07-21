const io = require( "socket.io" )();
const socketapi = {
    io: io
};
const onlineUsers = require("./onlineUsers");
const jwt = require("jsonwebtoken");

// Add your socket.io logic here!
io.use((socket, next) => {
  if (socket.handshake.auth && socket.handshake.auth.token) {
    jwt.verify(socket.handshake.auth.token, process.env.SESSION_SECRET, function(err, decoded) {
      if (err) return next(new Error('Authentication error'));
      socket.decoded = decoded;
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }
})
.on("connection", (socket) => {

  socket.on("go-online", (id) => {
      if (!onlineUsers[id]) {
        onlineUsers[id] = socket.id;
      }
      // send the user who just went online to everyone else who is already online
      socket.broadcast.emit("add-online-user", id);
    });
  
    socket.on("new-message", (data) => {
      const recipientId = data.recipientId;
      
      socket.to(onlineUsers[recipientId]).emit("new-message", {
        message: data.message,
        sender: data.sender,
      });
    });
  
    socket.on("logout", (id) => {
      if (onlineUsers[id]) {
        delete onlineUsers[id];
        socket.broadcast.emit("remove-offline-user", id);
      }
    });
  });
// end of socket.io logic

module.exports = socketapi;


