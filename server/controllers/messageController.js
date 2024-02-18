const Message = require("../models/Message");
const Room = require("../models/Room");

const createMessage = async (
  authorId,
  message,
  timeStamp,
  roomId,
  isRoom,
  receiverId,
  isFile
) => {
  try {
    const newMessage = new Message({
      isRoom: isRoom,
      author: authorId,
      receiver: receiverId,
      room: roomId,
      message: message,
      timestamp: timeStamp,
      isFile: isFile,
    });

    const savedMessage = await newMessage.save();

    // Update Room's messages array
    await Room.findByIdAndUpdate(roomId, {
      $push: { messages: savedMessage._id },
    });

    const populatedMessage = await savedMessage.populate(
      "author receiver room"
    );

    return {
      success: true,
      message: "Message created successfully",
      data: populatedMessage,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = {
  createMessage,
};
