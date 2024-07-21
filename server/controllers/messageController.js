const Message = require("../models/Message");
const Group = require("../models/Group");

const createMessage = async ({
  authorId,
  message,
  timestamp,
  groupId,
  isGroup,
  receiverId,
  isFile,
}) => {
  try {
    const newMessage = new Message({
      author: authorId,
      message,
      timestamp,
      group: groupId,
      isGroup,
      receiver: receiverId,
      isFile,
    });
    const savedMessage = await newMessage.save();

    await Group.findByIdAndUpdate(groupId, {
      $push: { messages: newMessage._id },
    });
    //TODO: use select for author and receiver and group for getting only required fields
    const populateMessage = await savedMessage.populate(
      "author receiver group"
    );

    return {
      success: true,
      message: "Message created successfully",
      data: populateMessage,
    };
  } catch (error) {
    console.log("Error in createMesaage:", error);
    return {
      success: false,
      message: "Error in creating message",
      data: null,
    };
  }
};

module.exports = {
  createMessage,
};
