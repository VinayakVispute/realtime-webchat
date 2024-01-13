const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { prismaClient } = require("./services/prisma");

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
  getAllMessagesInRoom,
  isUserAlreadyInRoom,
  getAllUsersInRoom,
  getMessageFromDatabase,
} = require("./services/prisma");

app.use(cors());

const port = process.env.PORT || 8000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  connectionStateRecovery: {},
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
    const messageObject = JSON.parse(message);
    const senderId = messageObject.senderData;
    const messageData = messageObject.messageData;
    io.to(senderId).emit("receive_message", messageData);
    const {
      isRoom,
      author,
      message: messageContent,
      receiver,
      timeStamp,
    } = messageData;
    try {
      await prismaClient.message.create({
        data: {
          isRoom: isRoom,
          author: author,
          message: messageContent,
          receiver: receiver,
          timestamp: timeStamp,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
});

io.on("connection", async (socket) => {
  socket.on("get_messages_from_database", async (data, cb) => {
    const { roomName, userName } = data;
    const messagesForUser = await getMessageFromDatabase(roomName, userName);
    cb(messagesForUser);
  });

  try {
    socket.on("join_server", ({ userName }) => {
      socket.userName = userName;
    });

    console.log(`User connected: ${socket.id}`);
    console.log("Before", io.sockets.adapter.rooms);

    let user;

    socket.on("join_room", async ({ username, roomId, id }, cb) => {
      console.log(
        `Received join_room request from user ${id} for room ${roomId}`
      );

      try {
        const userResponse = await findOrCreateUser(username, id);
        user = {
          socketId: socket.id,
          username: userResponse.name,
          id: userResponse.id,
        };

        const isUserAlreadyPresentInRoom = await isUserAlreadyInRoom(
          roomId,
          user.id,
          user.socketId
        );

        let usersInRoom;

        if (isUserAlreadyPresentInRoom) {
          console.log(`User ${user.username} already in room ${roomId}`);
          usersInRoom = await getAllUsersInRoom(roomId);
        } else {
          usersInRoom = await addUserToRoom(
            roomId,
            user.username,
            user.socketId
          );
          console.log(`User ${user.username} joined room ${roomId}`);
        }
        socket.join(roomId);

        console.log("InRoom", socket.id, io.sockets.adapter.rooms.get(roomId));

        const messagesFromDatabaseForRoom = await getAllMessagesInRoom(roomId);

        cb(messagesFromDatabaseForRoom);

        io.to(roomId).emit("user_join", usersInRoom);

        console.log(`user_join event emitted to room ${roomId}`);
      } catch (error) {
        console.error(`Error during join_room: ${error.message}`);
        // Handle errors during room joining
        socket.emit("socket_error", {
          error: error.message,
          type: "join_room",
        });
      }

      socket.on("send_message", async (data) => {
        try {
          const response = await pub.publish("MESSAGES", JSON.stringify(data));
          console.log("Message published:", data);
        } catch (error) {
          console.error(`Error during send_message: ${error.message}`);
          // Handle errors during message sending
          socket.emit("socket_error", {
            error: error.message,
            type: "send_message",
          });
        }
      });

      socket.on("leave_room", async () => {
        try {
          const usersInRoom = await usersRemoveFromRoom(roomId, user.id);
          socket.leave(roomId);
          io.to(roomId).emit("user_join", usersInRoom);
          console.log(`User ${user.username} left room ${roomId}`);
        } catch (error) {
          console.error(`Error during leave_room: ${error.message}`);
          // Handle errors during leaving room
          socket.emit("socket_error", {
            error: error.message,
            type: "leave_room",
          });
        }
      });

      socket.on("disconnecting", () => {
        console.log("while disconnecting", socket.rooms);
        for (const room of socket.rooms) {
          if (room !== socket.id) {
            io.to(room).emit("user_has_left", socket.id);
            console.log(`User ${user.username} has left room ${room}`);
          }
        }
      });

      socket.on("disconnect", async () => {
        try {
          const usersInRoom = await usersRemoveFromRoom(roomId, user.id);
          socket.leave(roomId);
          io.to(roomId).emit("user_join", usersInRoom);
          console.log(`User ${user.username} disconnected from room ${roomId}`);
        } catch (error) {
          console.error(`Error during disconnect: ${error.message}`);
          // Handle errors during disconnection
          socket.emit("socket_error", {
            error: error.message,
            type: "disconnect",
          });
        }
      });
    });
  } catch (error) {
    console.error(`Error during connection: ${error.message}`);
    // Handle errors during the initial connection
    socket.emit("socket_error", { error: error.message, type: "connection" });
  }
});
const start = async () => {
  try {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      // if (!kafkaStarted) {
      //   console.log("Starting Kafka");
      //   startMessageConsumer();
      //   kafkaStarted = true;
      // }
    });
  } catch (error) {
    console.log(error);
  }
};

start();
