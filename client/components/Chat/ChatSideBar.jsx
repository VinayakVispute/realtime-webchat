import React from "react";
import UserProfile from "./UserProfile";
import ConversationList from "./ConversationList";

const ChatSideBar = () => {
  return (
    <div className="flex flex-col p-2 w-64 bg-white dark:bg-gray-900 flex-shrink-0">
      <UserProfile />
      <ConversationList title="Active Conversations" count={4} />
    </div>
  );
};

export default ChatSideBar;
