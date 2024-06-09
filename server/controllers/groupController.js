const Group = require("../models/Group");

const createGroup = async (req, res) => {
  const { groupName, groupId } = req.body;
  try {
    const existingGroup = await Group.findOne({ groupId });
    if (existingGroup) {
      return res.status(400).json({
        success: false,
        message: "Group already exists",
      });
    }

    const group = new Group({ groupName, groupId });
    const newGroup = await group.save();
    return res.status(201).json({
      success: true,
      message: "Group created successfully",
      group: newGroup,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeUserFromGroup = async (groupId, mongoDbId) => {
  try {
    const group = await Group.findOne(
      { groupId },
      { members: 1, onlineUsers: 1 }
    );

    if (!group) {
      return {
        success: false,
        message: "Group not found",
      };
    }

    const isMember = group.members.some(
      (user) => user._id.toString() === mongoDbId.toString()
    );

    if (isMember) {
      group.members = group.members.filter(
        (user) => user._id.toString() !== mongoDbId.toString()
      );
    }

    const isOnlineUser = group.onlineUsers.some(
      (user) => user._id.toString() === mongoDbId.toString()
    );

    if (isOnlineUser) {
      group.onlineUsers = group.onlineUsers.filter(
        (user) => user._id.toString() !== mongoDbId.toString()
      );
    }

    const updatedGroup = await group.save();
    const groupData = await updatedGroup
      .populate("members onlineUsers")
      .execPopulate();

    return {
      success: true,
      message: "User removed from the group",
      data: {
        members: groupData.members,
        groupData: groupData.onlineUsers,
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
  createGroup,
  removeUserFromGroup,
};
