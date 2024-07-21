"use client";

import { useChat } from "@/context/ChatProvider";
import LeaveComponent from "./LeaveComponent";

const UserProfileTopBar = ({ groupName }: { groupName: string }) => {
  const { state, dispatch } = useChat();
  const { currentActiveUser, groupDetails } = state;

  const handleClickGroup = () => {
    if (
      !currentActiveUser.groupId ||
      !currentActiveUser.groupType ||
      !currentActiveUser._id ||
      !currentActiveUser.groupName
    ) {
      console.error("Invalid group details");
      return;
    }
    if (currentActiveUser.groupType === "group") {
      console.log("Already in the group");
      return;
    }
    dispatch({
      type: "ADD_CURRENT_ACTIVE_USER",
      payload: {
        ...groupDetails,
        groupType: "group",
      },
    });
  };
  return (
    <div
      className={
        "relative flex flex-col items-center justify-center bg-indigo-100 dark:bg-gray-800  border border-gray-200 dark:border-gray-700 mt-1 w-full py-1 px-2 rounded-lg"
      }
    >
      <div className="absolute right-2">
        <LeaveComponent />
      </div>
      <div
        className="text-xl font-bold my-2 cursor-pointer text-indigo-600 dark:text-indigo-300 "
        onClick={handleClickGroup}
      >
        {groupName}
      </div>
    </div>
  );
};

export default UserProfileTopBar;
