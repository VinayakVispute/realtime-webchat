import React from "react";
import ConversationItem from "./ConversationItem";

const ConversationList = ({ title, count }) => {
  const conversations = [
    { name: "Henry Boyd", initial: "H", bgColor: "bg-indigo-200" },
    {
      name: "Marta Curtis",
      initial: "M",
      bgColor: "bg-gray-200",
      unreadCount: 2,
    },
    { name: "Philip Tucker", initial: "P", bgColor: "bg-orange-200" },
    { name: "Christine Reid", initial: "C", bgColor: "bg-pink-200" },
    { name: "Jerry Guzman", initial: "J", bgColor: "bg-purple-200" },
    { name: "Henry Boyd", initial: "H", bgColor: "bg-indigo-200" },
    {
      name: "Marta Curtis",
      initial: "M",
      bgColor: "bg-gray-200",
      unreadCount: 2,
    },
    { name: "Philip Tucker", initial: "P", bgColor: "bg-orange-200" },
    { name: "Christine Reid", initial: "C", bgColor: "bg-pink-200" },
    { name: "Jerry Guzman", initial: "J", bgColor: "bg-purple-200" },
    { name: "Henry Boyd", initial: "H", bgColor: "bg-indigo-200" },
    {
      name: "Marta Curtis",
      initial: "M",
      bgColor: "bg-gray-200",
      unreadCount: 2,
    },
    { name: "Philip Tucker", initial: "P", bgColor: "bg-orange-200" },
    { name: "Christine Reid", initial: "C", bgColor: "bg-pink-200" },
    { name: "Jerry Guzman", initial: "J", bgColor: "bg-purple-200" },
    { name: "Henry Boyd", initial: "H", bgColor: "bg-indigo-200" },
    {
      name: "Marta Curtis",
      initial: "M",
      bgColor: "bg-gray-200",
      unreadCount: 2,
    },
    { name: "Philip Tucker", initial: "P", bgColor: "bg-orange-200" },
    { name: "Christine Reid", initial: "C", bgColor: "bg-pink-200" },
    { name: "Jerry Guzman", initial: "J", bgColor: "bg-purple-200" },
    { name: "Henry Boyd", initial: "H", bgColor: "bg-indigo-200" },
    {
      name: "Marta Curtis",
      initial: "M",
      bgColor: "bg-gray-200",
      unreadCount: 2,
    },
    { name: "Philip Tucker", initial: "P", bgColor: "bg-orange-200" },
    { name: "Christine Reid", initial: "C", bgColor: "bg-pink-200" },
    { name: "Jerry Guzman", initial: "J", bgColor: "bg-purple-200" },
  ];

  return (
    <div className="flex flex-col mt-8 h-full">
      <div className="flex flex-row items-center justify-between text-xs">
        <span className="font-bold">{title}</span>
        <span className="flex items-center justify-center bg-gray-300 dark:bg-gray-700 h-4 w-4 rounded-full">
          {count}
        </span>
      </div>
      <div className="flex flex-col space-y-1 mt-4 -mx-2 max-h-[50vh] overflow-y-auto">
        {conversations.map((conversation, index) => (
          <ConversationItem
            key={index}
            name={conversation.name}
            initial={conversation.initial}
            bgColor={conversation.bgColor}
            unreadCount={conversation.unreadCount}
          />
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
