const User = require("../models/User");
const Group = require("../models/Group.js");
const Message = require("../models/Message.js");

{
  /*const addUserToGroup = async (groupId, socketId, userName) => {
  try {
    const existingUser = await User.findOneAndUpdate(
      {
        userName,
      },
      {
        socketId,
      },
      {
        new: true,
      }
    );
    if (!existingUser) {
      return {
        success: false,
        message: "User not found 4",
      };
    }

    console.log("existingUser", existingUser);

    // Check if user is already a member of the group
    const isMember = await Group.exists({
      groupId,
      members: existingUser._id,
    });

    if (isMember) {
      return {
        success: false,
        message: "User is already a member of the group",
      };
    }

    // Update the group to add the user to members and onlineUsers
    const updatedGroup = await Group.findOneAndUpdate(
      {
        groupId,
      },
      {
        $addToSet: {
          members: existingUser._id,
          onlineUsers: existingUser._id,
        },
      },
      {
        new: true,
      }
    ).populate([
      {
        path: "onlineUsers",
      },
      {
        path: "messages",
        populate: [
          { path: "author" },
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

    if (!updatedGroup) {
      return {
        success: false,
        message: "Group not found",
      };
    }

    // Update the user to add the group to joinedGroups
    const updatedUser = await User.findByIdAndUpdate(
      existingUser._id,
      {
        $addToSet: {
          joinedGroups: updatedGroup._id,
        },
      },
      {
        new: true,
      }
    );

    return {
      success: true,
      message: "User added to group",
      data: {
        group: {
          _id: updatedGroup._id,
          groupId: updatedGroup.groupId,
          groupName: updatedGroup.groupName,
        },
        author: updatedUser,
        groupData: updatedGroup.onlineUsers,
        messages: updatedGroup.messages,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = {
  addUserToGroup,
};
*/
}
// TODO: Use select to only return the necessary fields
const joinTheGroup = async (groupId, socketId, userName) => {
  try {
    const existingUser = await User.findOneAndUpdate(
      {
        userName,
      },
      {
        socketId,
      },
      {
        new: true,
      }
    );

    const isMember = await Group.exists({
      groupId,
      members: existingUser._id,
    });

    if (!isMember) {
      return {
        success: false,
        message: "User is not a member of the group",
      };
    }

    const updatedGroup = await Group.findOneAndUpdate(
      {
        groupId,
      },
      {
        $addToSet: {
          onlineUsers: existingUser._id,
        },
      },
      {
        new: true,
      }
    ).populate([
      {
        path: "onlineUsers",
      },
      {
        path: "messages",
        populate: [
          { path: "author", select: "userName name profilePic socketId" },
          {
            path: "group",
            select: "groupId groupName groupPic",
          },
          {
            path: "receiver",
            select: "userName name profilePic socketId",
          },
        ],
      },
    ]);
    if (!updatedGroup) {
      return {
        success: false,
        message: "Group not found",
      };
    }
    return {
      success: true,
      message: "User added to group",
      data: {
        group: {
          _id: updatedGroup._id,
          groupId: updatedGroup.groupId,
          groupName: updatedGroup.groupName,
          groupPic: updatedGroup.groupPic,
        },
        author: existingUser,
        onlineUsers: updatedGroup.onlineUsers,
        messages: updatedGroup.messages,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
};

const removeUserFromOnline = async (groupId, mongoDbId) => {
  try {
    const updatedGroup = await Group.findOneAndUpdate(
      {
        groupId,
      },
      {
        $pull: {
          onlineUsers: mongoDbId,
        },
      },
      {
        new: true,
      }
    ).populate([
      {
        path: "onlineUsers",
      },
    ]);

    if (!updatedGroup) {
      return {
        success: false,
        message: "Group not found",
      };
    }

    return {
      success: true,
      message: "User removed from online users",
      data: {
        onlineUsers: updatedGroup.onlineUsers,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = {
  joinTheGroup,
  removeUserFromOnline,
};
