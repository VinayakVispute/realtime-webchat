// Import required modules
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Redis = require("ioredis");
const findSocketIdByUsername = require("./util/findSocketIdByUsername");
require("dotenv").config();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Set up server configuration
const port = process.env.PORT || 8000;
const server = http.createServer(app);

// Set up Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Create Redis publisher and subscriber instances for real-time communication
const pub = new Redis({
  host: process.env.REDIS_AIVEN_SERVER_HOST || "",
  port: process.env.REDIS_AIVEN_SERVER_PORT || "",
  username: process.env.REDIS_AIVEN_SERVER_USERNAME || "",
  password: process.env.REDIS_AIVEN_SERVER_PASSWORD || "",
});

const sub = new Redis({
  host: process.env.REDIS_AIVEN_SERVER_HOST || "",
  port: process.env.REDIS_AIVEN_SERVER_PORT || "",
  username: process.env.REDIS_AIVEN_SERVER_USERNAME || "",
  password: process.env.REDIS_AIVEN_SERVER_PASSWORD || "",
});

//check server connection
app.get("/", (req, res) => {
  res.send("Server is up &  running");
});

// Initialize an object to store room information
const rooms = {};

io.on("connection", (socket) => {
  // Handle new user joining a room
  socket.on("join_room", (data, cb) => {
    // Check if the room exists, if not, create it
    const { roomId, userName } = data;
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    // Check if the user is not already in the room
    if (!rooms[roomId].some((user) => user.userName === userName)) {
      // Add user to the room
      rooms[roomId].push({ userName, socketId: socket.id });
      console.log(`User ${userName} joined room ${roomId}`);
    }

    // Send all active users in the room to the new user

    socket.join(roomId);

    // Notify all users in the room about the new user
    io.to(roomId).emit("user-joined", { userName, socketId: socket.id });

    // Join the room
    cb(rooms[roomId]);
    console.log(socket.adapter.rooms);
  });

  //send message to the room

  socket.on("send_message", (data) => {
    const { isRoom, room, author, message, receiver, timestamp } = data;
    // console.log(data);
    console.log("send_message", data);
    if (isRoom) {
      io.to(receiver).emit("receive_message", data);
    } else {
      const receiverSocketId = findSocketIdByUsername(rooms[room], receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", data);
      }
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      // Remove user from the room
      rooms[roomId] = rooms[roomId].filter(
        (user) => user.socketId !== socket.id
      );

      // Notify other users in the room about the disconnected user
      io.to(roomId).emit("user-disconnected", { userId: socket.id });

      // Send updated user list to all users in the room
      io.to(roomId).emit("get-users", rooms[roomId]);
    }
  });

  // Handle user going offline
  socket.on("offline", () => {
    for (const roomId in rooms) {
      // Remove user from the room
      rooms[roomId] = rooms[roomId].filter(
        (user) => user.socketId !== socket.id
      );

      // Notify other users in the room about the offline user
      io.to(roomId).emit("user-offline", { userId: socket.id });

      // Send updated user list to all users in the room
      io.to(roomId).emit("get-users", rooms[roomId]);
    }
  });
});

// Define function to start the server
const start = async () => {
  try {
    // Start the server and listen on the specified port
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    // Handle any errors that may occur during server startup
    console.log("Error: ", error);
  }
};

// Call the start function to initiate server startup
start();
