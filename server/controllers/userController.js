const User = require("../models/User");
const Group = require("../models/Group");

const addUserToGroup = async (groupId, userName, socketId) => {
  try {
    const existingUser = await User.findOneAndUpdate(
      { userName },
      { socketId },
      {
        upsert: true,
        new: true,
      }
    );
    console.log("existingUser", existingUser);
    // Find group by groupId
    const group = await Group.findOne({ groupId });
    if (!group) {
      return {
        success: false,
        message: "Group not found",
      };
    }

    // Check if user is already a member of the group, if not, add to members
    if (
      !group.members.some(
        (user) => user._id.toString() === existingUser._id.toString()
      )
    ) {
      group.members.push(existingUser._id);
    }

    // Check if user is already online in the group, if not, add to onlineUsers
    if (
      !group.onlineUsers.some(
        (user) => user._id.toString() === existingUser._id.toString()
      )
    ) {
      group.onlineUsers.push(existingUser._id);
    }

    const updatedGroup = await group.save();
    const groupData = await updatedGroup.populate([
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
            path: "group",
            select: "groupId groupName",
          },
          {
            path: "receiver",
          },
        ],
      },
    ]);

    return {
      success: true,
      message: "User added to the group",
      data: {
        group: {
          _id: groupData._id,
          groupId: groupData.groupId,
          groupName: groupData.groupName,
        },
        author: existingUser,
        groupData: groupData.onlineUsers,
        messages: groupData.messages,
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
  addUserToGroup,
};
