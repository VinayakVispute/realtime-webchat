const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Redis = require("ioredis");
const prismaClient = require("./services/prisma");
const { produceMessage } = require("./services/kafka");

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

// Moved subscription and event listener setup outside the connection event
sub.subscribe("MESSAGES", (err, count) => {
  console.log("Subscribed to MESSAGES channel");
});

sub.on("message", async (channel, message) => {
  if (channel === "MESSAGES") {
    console.log("Message received from Redis", message);
    const roomId = JSON.parse(message).roomId;
    console.log(roomId);
    io.to(roomId).emit("receive_message", JSON.parse(message));
  }
});

io.on("connection", async (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", async (data) => {
    console.log("Message received from client", data);
    console.log(data.roomId, data);

    console.log("Message sent to Redis Waiting for response");
    const response = await pub.publish("MESSAGES", JSON.stringify(data), () => {
      console.log("Message sent to Redis");
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

const start = async () => {
  try {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
