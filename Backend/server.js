const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const PORT = process.env.PORT || 31098;
const FRONTEND_URL = process.env.FRONTEND_URL || "https://deeptalk1.netlify.app";

const app = express();
const server = http.createServer(app);

// ================= Database =================

const sequelize = require("./database/connectdb");

// Import Models
require("./models/userModel");
require("./models/contactModel");
require("./models/msgModel");

// ================= Middleware =================

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
    })
);

// ================= Routes =================

const web = require("./routes/web");

app.use("/api/deeptalk", web);

// ================= Socket.IO =================

const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
});

io.on("connection", (socket) => {

    //console.log("User Connected:", socket.id);

    socket.on("join", (userId) => {

        socket.join(userId.toString());

    });

    socket.on("send-message", (data) => {

        io.to(data.receiverId.toString()).emit(
            "receive-message",
            data
        );

    });

    socket.on("refresh-unread", (receiverId) => {

        io.to(receiverId.toString()).emit(
            "reload-unread"
        );

    });

    socket.on("message-seen", (data) => {

        io.to(data.senderId.toString()).emit(
            "reload-seen"
        );

    });

    socket.on("typing", (data) => {

        io.to(data.receiverId.toString()).emit(
            "show-typing",
            {
                senderId: data.senderId,
                senderName: data.senderName,
            }
        );

    });

    socket.on("stop-typing", (data) => {

        io.to(data.receiverId.toString()).emit(
            "hide-typing",
            {
                senderId: data.senderId,
            }
        );

    });

    socket.on("disconnect", () => {

        //console.log("User Disconnected:", socket.id);

    });

});

// ================= Start Server =================

(async () => {

    try {

        await sequelize.authenticate();

        console.log("Database Connected Successfully");

        // Create tables only if they don't exist
        await sequelize.sync();

        console.log("Tables Created / Verified");

        server.listen(PORT, () => {

            console.log(`Server started on port ${PORT}`);

        });

    } catch (error) {

        console.error("Server Startup Failed");
        console.error(error);

        process.exit(1);

    }

})();