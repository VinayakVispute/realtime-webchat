// ChatNavbar.tsx
"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, LogOut, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import LeaveComponent from "./LeaveComponent";
import { useChat } from "@/context/ChatProvider";

const ChatNavbar = () => {
  const { currentActiveUser } = useChat().state;
  const handleSearch = () => {
    // Handle search action
  };
  const { groupName, groupPic } = currentActiveUser;
  return (
    <div className="flex items-center justify-between bg-indigo-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex items-center">
        <Avatar>
          <AvatarImage src={groupPic} alt={`${groupName} Profile Image`} />
          <AvatarFallback>{groupName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="ml-2 text-lg font-bold">{groupName}</div>
      </div>
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon" onClick={handleSearch}>
          <Search className="h-5 w-5" />
        </Button>
        <LeaveComponent />
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatNavbar;
