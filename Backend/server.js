const http = require("http");
const { Server } = require("socket.io");
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const web = require('./routes/web');

dotenv.config();

const PORT = process.env.PORT;
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://deeptalk.netlify.app",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const sequelize = require('./database/connectdb');
sequelize.sync().then(() => {
  console.log('Database connected successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});

const bodyParser = require('body-parser');

app.use(express.json());

app.use(
  cors({
    origin: "https://deeptalk.netlify.app",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

io.on("connection", (socket) => {

  //console.log("User Connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId.toString());
    //console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on("send-message", (data) => {
    io.to(data.receiverId.toString()).emit("receive-message", data);
  });

  socket.on("refresh-unread", (receiverId) => {
    io.to(receiverId.toString()).emit("reload-unread");
  });

  socket.on("message-seen", (data) => {
    io.to(data.senderId.toString()).emit("reload-seen");
  });

  // ---------- TYPING EVENTS ----------
  socket.on("typing", (data) => {
    io.to(data.receiverId.toString()).emit("show-typing", {
      senderId: data.senderId,
      senderName: data.senderName
    });
  });

  socket.on("stop-typing", (data) => {
    io.to(data.receiverId.toString()).emit("hide-typing", {
      senderId: data.senderId
    });
  });
  // -----------------------------------

  socket.on("disconnect", () => {
    //console.log("User Disconnected:", socket.id);
  });

});

app.use('/api/deeptalk', web);

server.listen(PORT, () => {
  console.log(`Server is started on port ${PORT}`);
});
