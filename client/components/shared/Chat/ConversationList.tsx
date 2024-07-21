import React from "react";
import ConversationItem from "./ConversationItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatStateInterface } from "@/interfaces";
import { getInitials } from "@/utils";

const ConversationList = ({
  title,
  count,
  onlineUsers,
}: {
  title: string;
  count: number;
  onlineUsers: ChatStateInterface["onlineUsers"];
}) => {
  return (
    <div className="flex flex-col mt-8 ">
      <div className="flex flex-row items-center justify-between text-xs overflow-y-hidden">
        <span className="font-bold">{title}</span>
        <span className="flex items-center justify-center bg-gray-300 dark:bg-gray-700 h-4 w-4 rounded-full">
          {count}
        </span>
      </div>
      <ScrollArea className="flex flex-col space-y-1 mt-4 -mx-2 max-h-[65vh] overflow-y-hidden">
        {onlineUsers.map((onlineUser, index) => (
          <ConversationItem
            key={index}
            userId={onlineUser._id}
            name={onlineUser.name}
            initial={getInitials(onlineUser.name)}
            profilePic={onlineUser.profilePic}
            userName={onlineUser.userName}
            socketId={onlineUser.socketId}
            // unreadCount={onlineUser.unreadCount}
          />
        ))}
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
