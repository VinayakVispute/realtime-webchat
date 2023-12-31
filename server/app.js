const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
let kafkaStarted = false;
const Redis = require("ioredis");
const {
  produceMessage,
  startMessageConsumer,
  kafka,
} = require("./services/kafka");
const {
  findOrCreateUser,
  addUserToRoom,
  usersRemoveFromRoom,
} = require("./services/prisma");
const { constants } = require("buffer");

app.use(cors());

const port = process.env.PORT || 8000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const pub = new Redis({
  host: "real-time-server-vinayakvispute4-1688.a.aivencloud.com",
  port: "12527",
  username: "default",
  password: "AVNS_oRqFLCU85r-lAtgJCTY",
});
const sub = new Redis({
  host: "real-time-server-vinayakvispute4-1688.a.aivencloud.com",
  port: "12527",
  username: "default",
  password: "AVNS_oRqFLCU85r-lAtgJCTY",
});

let users = [];

// Moved subscription and event listener setup outside the connection event
sub.subscribe("MESSAGES", (err, count) => {
  console.log("Subscribed to MESSAGES channel");
});

sub.subscribe("USERS", (err, count) => {
  console.log("Subscribed to USERS channel");
});

sub.on("message", async (channel, message) => {
  if (channel === "MESSAGES") {
    console.log("Message received from Redis", message);
    const roomId = JSON.parse(message).roomId;
    console.log(roomId);
    io.to(roomId).emit("receive_message", JSON.parse(message));
    await produceMessage(message);
    console.log("Message sent to Kafka");
  }
});

io.on("connection", async (socket) => {
  socket.on("join_room", async ({ username, roomId, id }) => {
    const userResponse = await findOrCreateUser(username, id);
    console.log("userResponse", userResponse);
    const user = {
      socketId: socket.id,
      username: userResponse.name,
      id: userResponse.id,
    };
    console.log("user", user);
    const usersInRoom = await addUserToRoom(roomId, user.username);
    console.log("usersInRoom", usersInRoom);
    console.log(`User Connected: ${user.socketId} && ${user.username}`);
    socket.join(roomId);
    console.log(`User with ID: ${socket.id} joined room: ${roomId}`);
    socket.to(roomId).emit("user_join", usersInRoom);
    socket.emit("user_join", usersInRoom);
    socket.on("send_message", async (data) => {
      console.log("Message received from client", data);
      console.log(data.roomId, data);

      console.log("Message sent to Redis Waiting for response");
      const response = await pub.publish(
        "MESSAGES",
        JSON.stringify(data),
        () => {
          console.log("Message sent to Redis");
        }
      );
    });

    socket.on("disconnect", async () => {
      const usersInRoom = await usersRemoveFromRoom(roomId, userResponse.id);
      console.log("usersInRoomAfter Removal", usersInRoom);
      socket.to(roomId).emit("user_join", usersInRoom);
      console.log("user disconnected", socket.id);
    });
  });
});

const start = async () => {
  try {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      if (!kafkaStarted) {
        console.log("Starting Kafka");
        startMessageConsumer();
        kafkaStarted = true;
      }
    });
  } catch (error) {
    console.log(error);
  }
};

start();
