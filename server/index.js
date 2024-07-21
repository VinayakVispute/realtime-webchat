const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const fileUpload = require("express-fileupload");
const { Server } = require("socket.io");
const Redis = require("ioredis");
const connectDB = require("./services/mongoose");
const {
  joinTheGroup,

  removeUserFromOnline,
} = require("./controllers/userControllers");
const { createMessage } = require("./controllers/messageController");
const { checkUserInGroup } = require("./utils/checkUserInGroup");
const { findGroupForUser } = require("./utils/findGroupForUser");
require("dotenv").config();

app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

const port = process.env.PORT || 8000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// Redis setup
const redisOptions = {
  host: process.env.REDIS_AIVEN_SERVER_HOST,
  port: process.env.REDIS_AIVEN_SERVER_PORT,
  username: process.env.REDIS_AIVEN_SERVER_USERNAME,
  password: process.env.REDIS_AIVEN_SERVER_PASSWORD,
};

const pub = new Redis(redisOptions);
const sub = new Redis(redisOptions);

sub.subscribe("USERSCHANNEL", (errUsers, countUsers) => {
  if (errUsers) {
    console.log("Error in subscribing to USERSCHANNEL:", errUsers);
  } else {
    console.log("Subscribed to USERSCHANNEL");
  }
});

sub.subscribe("MESSAGES", (errMessages, countMessages) => {
  if (errMessages) {
    console.log("Error in subscribing to MESSAGES:", errMessages);
  } else {
    console.log("Subscribed to MESSAGES");
  }
});

sub.on("message", (channel, message) => {
  if (channel === "USERSCHANNEL") {
    const { to, event, data, currentSocketId } = JSON.parse(message);
    io.to(to).except(currentSocketId).emit(event, data);
  } else if (channel === "MESSAGES") {
    const { sender, messageContent, socketId } = JSON.parse(message);
    io.to(sender).except(socketId).emit("receive_message", messageContent);
  }
});

app.use("/", (req, res) => {
  res.send("Server is running");
});

io.on("connection", (socket) => {
  console.log("A User With ID: " + socket.id + " Connected");

  socket.on("send_message", async (data) => {
    const { isGroup, group, author, message, receiver, timestamp, isFile } =
      data;
    const authorId = author._id.toString();
    const receiverId = receiver?._id.toString();
    const groupId = group._id.toString();
    const messageSaved = await createMessage({
      authorId,
      message,
      timestamp,
      groupId,
      isGroup,
      receiverId,
      isFile,
    });
    if (isGroup) {
      await pub.publish(
        "MESSAGES",
        JSON.stringify({
          sender: group.groupId,
          messageContent: data,
          socketId: socket.id,
        })
      );
      // socket.to(room.roomId).emit("receive_message", data);
    } else {
      await pub.publish(
        "MESSAGES",
        JSON.stringify({
          sender: receiver.socketId,
          messageContent: data,
          socketId: socket.id,
        })
      );
      // socket.to(receiver.socketId).emit("receive_message", data);
    }
  });

  socket.on("checkUserInGroup", (data, cb) => {
    const { groupId } = data;

    const isSuccess = checkUserInGroup(
      socket.adapter.rooms,
      groupId,
      socket.id
    );

    cb({ isSuccess });
  });

  socket.on("disconnecting", async () => {
    console.log("User Disconnecting " + socket.id);
    const groupIdForUser = findGroupForUser(socket.adapter.rooms, socket.id);
    if (groupIdForUser) {
      socket.leave(groupIdForUser);
      const updatedUsers = await removeUserFromOnline(
        groupIdForUser,
        socket.mongoDbId
      );

      if (updatedUsers.success && updatedUsers.data) {
        pub.publish(
          "USERSCHANNEL",
          JSON.stringify({
            to: groupIdForUser,
            event: "user-disconnected",
            currentSocketId: socket.id,
            data: {
              userName: socket.userName,
              users: updatedUsers.data.onlineUsers,
            },
          })
        );

        console.log("User Disconnected from group");
      }
    }
  });
  // ------Join Group Start -----
  socket.on("join_group", async (data, callback) => {
    try {
      const { groupId, userName } = data;
      socket.userName = userName;
      console.log(`User ${userName} & ${socket.id} joined group ${groupId}`);

      const response = await joinTheGroup(groupId, socket.id, userName);
      if (!response.success) {
        return callback({
          success: response.success,
          message: response.message,
          data: null,
        });
      }
      console.log("Chat Message", response.data.messages);
      socket.join(groupId);

      const author = response.data.author;
      const onlineUsers = response.data.onlineUsers;
      socket.mongoDbId = author._id.toString();

      pub.publish(
        "USERSCHANNEL",
        JSON.stringify({
          to: groupId,
          event: "user-joined",
          currentSocketId: socket.id,
          data: {
            userName: author.userName,
            users: onlineUsers,
          },
        })
      );
      callback({
        success: true,
        message: "User joined the group dfdfd",
        data: {
          group: response.data.group,
          onlineUsers: response.data.onlineUsers,
          author: author,
          messages: response.data.messages || [],
        },
      });
    } catch (error) {
      console.log("Error in join_group:", error);
      callback({ success: true, message: "User joined the group" });
    }
  });
  //------Join Group End -----
  socket.on("disconnect", () => {
    console.log("User Disconnected " + socket.id);
  });
  socket.on("offline", async () => {
    const groupIdForUser = findGroupForUser(socket.adapter.rooms, socket.id);

    if (groupIdForUser) {
      socket.leave(groupIdForUser);

      const updatedUsers = await removeUserFromOnline(
        groupIdForUser,
        socket.mongoDbId
      );

      if (updatedUsers.success && updatedUsers.data) {
        pub.publish(
          "USERSCHANNEL",
          JSON.stringify({
            to: groupIdForUser,
            event: "user-disconnected",
            currentSocketId: socket.id,
            data: {
              userName: socket.userName,
              users: updatedUsers.data.onlineUsers,
            },
          })
        );

        console.log(
          `User ${socket.userName} disconnecting from room ${groupIdForUser}`
        );
      }
    }
  });
});

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log("Error: ", error);
  }
};

start();
