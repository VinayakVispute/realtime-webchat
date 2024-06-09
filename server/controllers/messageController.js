const Message = require("../models/Message");
const Group = require("../models/Group");

const createMessage = async (
  authorId,
  message,
  timeStamp,
  groupId,
  isGroup,
  receiverId,
  isFile
) => {
  try {
    const newMessage = new Message({
      isGroup: isGroup,
      author: authorId,
      receiver: receiverId,
      group: groupId,
      message: message,
      timestamp: timeStamp,
      isFile: isFile,
    });

    const savedMessage = await newMessage.save();

    // Update Group's messages array
    await Group.findByIdAndUpdate(groupId, {
      $push: { messages: savedMessage._id },
    });

    const populatedMessage = await savedMessage.populate(
      "author receiver group"
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
