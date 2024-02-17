const Room = require("../models/Room");

const createRoom = async (req, res) => {
  const { roomName, roomId } = req.body;
  try {
    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: "Room already exists",
      });
    }

    const room = new Room({ roomName, roomId });
    const newRoom = await room.save();
    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      room: newRoom,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeUserFromRoom = async (roomId, mongoDbId) => {
  try {
    const room = await Room.findOne({ roomId }, { onlineUsers: 1 });

    if (!room) {
      return {
        success: false,
        message: "Room not found",
      };
    }
    console.log("room", room);
    if (
      room.onlineUsers.some(
        (user) => user._id.toString() === mongoDbId.toString()
      )
    ) {
      room.onlineUsers = room.onlineUsers.filter(
        (user) => user._id.toString() !== mongoDbId.toString()
      );
    }

    const updatedRoom = await room.save();
    const roomData = await updatedRoom.populate("onlineUsers");

    return {
      success: true,
      message: "User removed from the room",
      data: {
        roomData: roomData?.onlineUsers,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = {
  createRoom,
  removeUserFromRoom,
};
