"use server";
import Group from "@/database/Group.model";
import mongoose from "mongoose";
import { connectToDatabase } from "../mongoose";
import {
  addUserToGroupParamsInterface,
  createGroupParamsInterface,
  getAllGroupsListParamsInterface,
  removeGroupParamsInterface,
} from "@/interfaces";
import User from "@/database/User.model";
import { revalidatePath } from "next/cache";

export async function createGroup(params: createGroupParamsInterface) {
  const { groupName, groupId } = params;
  try {
    connectToDatabase();
    const existingGroup = await Group.findOne({
      groupId,
    });
    if (existingGroup) {
      return {
        success: false,
        message: "Group already exists",
      };
    }

    const newGroup = await Group.create({
      groupName,
      groupId,
    });
    // TODO: USE SELECT IN MONGODB TO SELECT ONLY THE FIELDS YOU NEED
    return {
      success: true,
      message: "Group created successfully",
      data: JSON.parse(JSON.stringify(newGroup)),
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
}

// TODO: Remaining to  implement

{
  /*export async function removeFromGroup(params: removeGroupParamsInterface) {
  const { mongoDbId, groupId } = params;

  try {
    connectToDatabase();
    // Update the group by pulling the user from members and onlineUsers arrays
    const updateResult = await Group.updateOne(
      { groupId },
      {
        $pull: {
          members: mongoDbId,
          onlineUsers: mongoDbId,
        },
      },
      {
        new: true,
      }
    ).populate("members onlineUsers");
    console.log(updateResult);
    if (updateResult.matchedCount === 0) {
      return {
        success: false,
        message: "Group not found",
      };
    }

    const updatedUser = await User.findByIdAndUpdate(mongoDbId, {
      $pull: {
        groups: groupId,
      },
    });

    if (!updatedUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Retrieve and populate the updated group data
    // const updatedGroup = await Group.findOne({ groupId }).populate(
    //   "members onlineUsers"
    // );

    return {
      success: true,
      message: "User removed from group",
      data: {
        members: updateResult?.members,
        onlineUsers: updateResult?.onlineUsers,
      },
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
}*/
}

//TODO : Add Revalidation for all server side functions
//TODO : Add Pagination

export async function getAllGroupsList(
  params: getAllGroupsListParamsInterface
) {
  //groupName
  // Total No of Members
  // 5 Members Users profilePic
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;
    const skip = (page - 1) * pageSize;
    console.log("this is user id", userId);
    const user = await User.findById(userId)
      .populate({
        path: "joinedGroups",
        select: "_id groupName members groupPic groupId",
        populate: {
          path: "members",
          model: User,
          select: "profilePic",
        },
      })
      .select("joinedGroups");

    if (!user) {
      return {
        success: false,
        message: "User not found 1",
        data: null,
      };
    }

    const joinedGroups = user.joinedGroups;
    const totalGroups = joinedGroups.length;
    const totalMembersPerGroup = joinedGroups.map((group: any) => {
      return {
        _id: group._id,
        groupName: group.groupName,
        totalMembers: group.members.length,
        groupPic: group.groupPic,
        members: group.members.slice(0, 5),
        groupId: group.groupId,
      };
    });
    // revalidatePath("/Dashboard");
    return {
      success: true,
      message: "Groups fetched successfully",
      data: {
        totalGroups: totalGroups,
        totalMembersPerGroup: JSON.parse(JSON.stringify(totalMembersPerGroup)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function addUserToGroup(params: addUserToGroupParamsInterface) {
  try {
    connectToDatabase();
    const { groupId, userName } = params;
    const existingUser = await User.findOne({
      userName,
    });

    if (!existingUser) {
      return {
        success: false,
        message: "User not found 2",
      };
    }

    const isMember = await Group.exists({
      groupId,
      members: existingUser._id,
    });

    if (isMember) {
      return {
        success: false,
        message: "User already a member of the group",
      };
    }

    const updatedGroup = await Group.findOneAndUpdate(
      {
        groupId,
      },
      { $addToSet: { members: existingUser._id } }
    );

    if (!updatedGroup) {
      return {
        success: false,
        message: "Group not found",
      };
    }

    const updatedUser = await User.findByIdAndUpdate(existingUser._id, {
      $addToSet: { joinedGroups: updatedGroup._id },
    });

    if (!updatedUser) {
      return {
        success: false,
        message: "User not found 3",
      };
    }
    revalidatePath("/Dashboard");

    return {
      success: true,
      message: "User added to group",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      //@ts-ignore
      message: error.message,
    };
  }
}

export async function removeGroup(params: removeGroupParamsInterface) {
  try {
    connectToDatabase();
    const { groupId, mongoDbId } = params;
    const updatedResult = await Group.findOneAndUpdate(
      { groupId },
      {
        $pull: { members: mongoDbId, onlineUsers: mongoDbId },
      }
    );

    if (!updatedResult) {
      return {
        success: false,
        message: "Group not found",
      };
    }

    const updatedUser = await User.findByIdAndUpdate(mongoDbId, {
      $pull: { joinedGroups: updatedResult._id },
    });

    if (!updatedUser) {
      return {
        success: false,
        message: "User not found",
      };
    }
    revalidatePath("/Dashboard");
    return {
      success: true,
      message: "User removed from group",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
}
