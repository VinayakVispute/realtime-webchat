import React from "react";

const ConversationItem = ({ name, initial, bgColor, unreadCount }) => {
  return (
    <button className="flex flex-row items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl p-2">
      <div
        className={`flex items-center justify-center h-8 w-8 ${bgColor} rounded-full`}
      >
        {initial}
      </div>
      <div className="ml-2 text-sm font-semibold">{name}</div>
      {unreadCount && (
        <div className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none">
          {unreadCount}
        </div>
      )}
    </button>
  );
};

export default ConversationItem;
