// Import required modules
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const Redis = require("ioredis");
const findSocketIdByUsername = require("./util/findSocketIdByUsername");
const checkUserInRoom = require("./util/checkUserInRoom");
const connectDB = require("./services/database");
const { addUserToRoom } = require("./controllers/userController");
require("dotenv").config();
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
app.use(bodyParser.json());
// Routes Import
const roomRoutes = require("./routes/roomRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { createMessage } = require("./controllers/messageController");
const findRoomForUser = require("./util/findRoomForUser");
const { removeUserFromRoom } = require("./controllers/RoomController");
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

// Use the routes

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

app.use("/rooms", roomRoutes);
app.use("/messages", messageRoutes);

sub.subscribe("USERSCHANNEL", (err, count) => {
  if (err) {
    console.log("Error in subscribing to USERSCHANNEL");
  }
  console.log("Subscribed to USERSCHANNEL");
});

sub.on("message", (channel, message) => {
  if (channel === "USERSCHANNEL") {
    console.log("Received message from USERSCHANNEL: ", message);
  }
});

// Initialize an object to store room information
const rooms = {};

io.on("connection", (socket) => {
  // Handle new user joining a room
  socket.on("join_room", async (data, cb) => {
    // Check if the room exists, if not, create it
    const { roomId, userName } = data;
    socket.userName = userName;
    console.log(`User ${userName} & ${socket.id} joined room ${roomId}`);
    // if (!rooms[roomId]) {
    //   rooms[roomId] = [];
    // }

    // // Check if the user is not already in the room
    // if (!rooms[roomId].some((user) => user.userName === userName)) {
    //   // Add user to the room
    //   rooms[roomId].push({ userName, socketId: socket.id });
    //   console.log(`User ${userName} joined room ${roomId}`);
    // }
    const response = await addUserToRoom(roomId, userName, socket.id);
    // Send all active users in the room to the new user
    // console.log("response", response);
    socket.join(roomId);

    const author = response.data.author;
    // Notify all users in the room about the new user
    socket.mongoDbId = author._id;
    io.to(roomId).emit("user-joined", {
      userName: author.userName,
      socketId: author.socketId,
    });
    // Join the room
    // cb(rooms[roomId]);
    cb({
      room: {
        _id: response.data.room._id,
        roomId: response.data.room.roomId,
        roomName: response.data.room.roomName,
      },
      onlineUsers: response.data.roomData,
      author: author,
      messages: response.data.messages || [],
    });
  });

  //send message to the room

  socket.on("send_message", async (data) => {
    const { isRoom, room, author, message, receiver, timestamp } = data;
    const authorId = author?._id;
    const receiverId = receiver?._id;
    const roomId = room?._id;
    const messageSaved = await createMessage(
      authorId,
      message,
      timestamp,
      roomId,
      isRoom,
      receiverId
    );
    if (isRoom) {
      socket.to(room.roomId).emit("receive_message", data);
    } else {
      socket.to(receiver.socketId).emit("receive_message", data);
    }
  });

  socket.on("checkUserInRoom", (data, cb) => {
    const { roomId } = data;
    const success = checkUserInRoom(socket.adapter.rooms, roomId, socket.id);

    cb({
      success,
    });
  });

  socket.on("disconnecting", async () => {
    const roomIdForUser = findRoomForUser(socket.adapter.rooms, socket.id);
    console.log("roomIdForUser", roomIdForUser);
    if (roomIdForUser) {
      socket.leave(roomIdForUser);

      const updatedUsers = await removeUserFromRoom(
        roomIdForUser,
        socket.mongoDbId
      );
      if (updatedUsers.success) {
        // Notify other users in the room about the offline user
        io.to(roomIdForUser).emit("user-disconnected", {
          userName: socket.userName,
          users: updatedUsers.data.roomData,
        });

        console.log(
          `User ${socket.userName} disconnecting from room ${roomIdForUser}`
        );
      }
      // io.to(roomIdForUser).emit("user-disconnected", {
      //   userName: socket.userName,
      //   users: rooms[roomId],
      // });
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User ${socket.userName} disconnected`);
  });

  // Handle user going offline
  socket.on("offline", async () => {
    const roomIdForUser = findRoomForUser(socket.adapter.rooms, socket.id);
    console.log("roomIdForUser", roomIdForUser);
    if (roomIdForUser) {
      socket.leave(roomIdForUser);

      const updatedUsers = await removeUserFromRoom(
        roomIdForUser,
        socket.mongoDbId
      );
      console.log("updatedUsers", updatedUsers);
      if (updatedUsers.success) {
        // Notify other users in the room about the offline user
        io.to(roomIdForUser).emit("user-disconnected", {
          userName: socket.userName,
          users: updatedUsers.data.roomData,
        });

        console.log(
          `User ${socket.userName} disconnecting from room ${roomIdForUser}`
        );
      }
    }
  });
});

// Define function to start the server
const start = () => {
  try {
    // Start the server and listen on the specified port
    server.listen(port, async () => {
      await connectDB(process.env.MONGODB_URL);
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    // Handle any errors that may occur during server startup
    console.log("Error: ", error);
  }
};

// Call the start function to initiate server startup
start();
