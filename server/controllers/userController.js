const User = require("../models/User");
const Room = require("../models/Room");
const addUserToRoom = async (roomId, userName, socketId) => {
  try {
    const existingUser = await User.findOneAndUpdate(
      { userName },
      { socketId },
      {
        upsert: true,
        new: true,
      }
    );
    // find room exist or not
    const room = await Room.findOne({ roomId: roomId });
    if (!room) {
      return {
        success: false,
        message: "Room not found",
      };
    }
    // check if user is already in the room
    if (
      !room.onlineUsers.some(
        (user) => user._id.toString() === existingUser._id.toString()
      )
    ) {
      room.onlineUsers.push(existingUser._id);
    }
    const updatedRoom = await room.save();
    const roomData = await updatedRoom.populate([
      {
        path: "onlineUsers",
      },
      {
        path: "messages",
        populate: [
          {
            path: "author",
          },
          {
            path: "room",
            select: "roomId roomName",
          },
          {
            path: "receiver",
          },
        ],
      },
    ]);

    return {
      success: true,
      message: "User added to the room",
      data: {
        room: {
          _id: roomData._id,
          roomId: roomData.roomId,
          roomName: roomData.roomName,
        },
        author: existingUser,
        roomData: roomData?.onlineUsers,
        messages: roomData?.messages,
      },
    };
  } catch (error) {
    console.log("error", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = {
  addUserToRoom,
};
