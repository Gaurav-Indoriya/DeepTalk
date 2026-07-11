import { io } from "socket.io-client";

const socket = io("http://localhost:31098", {
    transports: ["websocket"],
    withCredentials: true,
});

export default socket;