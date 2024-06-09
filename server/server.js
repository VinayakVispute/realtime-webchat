// Import required modules
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const fileUpload = require("express-fileupload");
const { Server } = require("socket.io");
const Redis = require("ioredis");
const findSocketIdByUsername = require("./util/findSocketIdByUsername");
const checkUserInGroup = require("./util/checkUserInGroup");
const connectDB = require("./services/database");

const { cloudinaryConnect } = require("./services/cloudinary");
const { addUserToGroup } = require("./controllers/userController");

require("dotenv").config();
// Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
// Routes Import
const groupRoutes = require("./routes/groupRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { createMessage } = require("./controllers/messageController");
const findGroupForUser = require("./util/findGroupForUser");
const { removeUserFromGroup } = require("./controllers/groupController");
const { fileUploadCloudnary } = require("./controllers/fileUploadController");
// Set up server configuration
const port = process.env.PORT || 8000;
const server = http.createServer(app);

// Set up Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
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

// Check server connection
app.get("/", (req, res) => {
  res.send("Server is up & running");
});

app.use("/groups", groupRoutes);
app.use("/messages", messageRoutes);
app.use("/upload", fileUploadCloudnary);

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
    console.log("except", currentSocketId);
    io.to(to).except(currentSocketId).emit(event, data);
  } else if (channel === "MESSAGES") {
    const { sender, messageContent, socketId } = JSON.parse(message);
    console.log("except", socketId);
    io.to(sender).except(socketId).emit("receive_message", messageContent);
  }
});

io.on("connection", (socket) => {
  // Handle new user joining a group
  socket.on("join_group", async (data, cb) => {
    // Check if the group exists, if not, create it
    const { groupId, userName } = data;
    socket.userName = userName;
    console.log(`User ${userName} & ${socket.id} joined group ${groupId}`);

    const response = await addUserToGroup(groupId, userName, socket.id);
    socket.join(groupId);

    const author = response.data.author;

    socket.mongoDbId = author._id;

    // Notify all users in the group about the new user
    pub.publish(
      "USERSCHANNEL",
      JSON.stringify({
        to: groupId,
        event: "user-joined",
        currentSocketId: socket.id,
        data: {
          userName: author.userName,
          socketId: author.socketId,
        },
      })
    );

    cb({
      group: {
        _id: response.data.group._id,
        groupId: response.data.group.groupId,
        groupName: response.data.group.groupName,
      },
      onlineUsers: response.data.onlineUsers,
      author: author,
      messages: response.data.messages || [],
    });
  });

  // Send message to the group
  socket.on("send_message", async (data) => {
    const { isGroup, group, author, message, receiver, timestamp, isFile } =
      data;
    const authorId = author?._id;
    const receiverId = receiver?._id;
    const groupId = group?._id;
    console.log("isFile", isFile);
    const messageSaved = await createMessage(
      authorId,
      message,
      timestamp,
      groupId,
      isGroup,
      receiverId,
      isFile
    );
    console.log("messageSaved", messageSaved);
    if (isGroup) {
      await pub.publish(
        "MESSAGES",
        JSON.stringify({
          sender: group.groupId,
          messageContent: data,
          socketId: socket.id,
        })
      );
    } else {
      await pub.publish(
        "MESSAGES",
        JSON.stringify({
          sender: receiver.socketId,
          messageContent: data,
          socketId: socket.id,
        })
      );
    }
  });

  socket.on("checkUserInGroup", (data, cb) => {
    const { groupId } = data;
    const success = checkUserInGroup(socket.adapter.rooms, groupId, socket.id);

    cb({
      success,
    });
  });

  socket.on("disconnecting", async () => {
    const groupIdForUser = findGroupForUser(socket.adapter.rooms, socket.id);

    if (groupIdForUser) {
      socket.leave(groupIdForUser);

      const updatedUsers = await removeUserFromGroup(
        groupIdForUser,
        socket.mongoDbId
      );
      if (updatedUsers.success) {
        // Notify other users in the group about the offline user
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
          `User ${socket.userName} disconnecting from group ${groupIdForUser}`
        );
      }
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User ${socket.userName} disconnected`);
  });

  // Handle user going offline
  socket.on("offline", async () => {
    const groupIdForUser = findGroupForUser(socket.adapter.rooms, socket.id);

    if (groupIdForUser) {
      socket.leave(groupIdForUser);

      const updatedUsers = await removeUserFromGroup(
        groupIdForUser,
        socket.mongoDbId
      );
      console.log("updatedUsers", updatedUsers);

      if (updatedUsers.success) {
        // Notify other users in the group about the offline user
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
          `User ${socket.userName} disconnecting from group ${groupIdForUser}`
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
      cloudinaryConnect();

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

{
  /* sub.on("message", (channel, message) => {
  // if (isRoom) {
  //   await pub.publish(
  //     "MESSAGES",
  //     JSON.stringify({ sender: room.roomId, messageContent: data })
  //   );
  //   // socket.to(room.roomId).emit("receive_message", data);
  // } else {
  //   await pub.publish(
  //     "MESSAGES",
  //     JSON.stringify({ sender: receiver.socketId, messageContent: data })
  //   );
  //   // socket.to(receiver.socketId).emit("receive_message", data);
  // }
  if (channel === "USERSCHANNEL") {
    // pub.publish(
    //   "USERSCHANNEL",
    //   JSON.stringify({
    //     to: roomIdForUser,
    //     event: "user-disconnected",
    //     data: {
    //       userName: socket.userName,
    //       users: updatedUsers.data.roomData,
    //     },
    //   })
    // );

    const { to, event, data, currentSocketId } = JSON.parse(message);
    console.log("except", currentSocketId);
    io.to(to).except(currentSocketId).emit(event, data);
  } else if (channel === "MESSAGES") {
    const { sender, messageContent, socketId } = JSON.parse(message);
    console.log("expect", socketId);
    io.to(sender).except(socketId).emit("receive_message", messageContent);
  }
});*/
}
