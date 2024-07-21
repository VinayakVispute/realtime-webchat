"use client";
import UserProfile from "./UserProfile";
import ConversationList from "./ConversationList";
import { useChat } from "@/context/ChatProvider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { isObjectEmpty } from "@/utils";

const ChatSideBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { state } = useChat();
  const { author, onlineUsers, groupDetails } = state;
  const groupName = groupDetails?.groupName ?? "";

  useEffect(() => {
    if (isObjectEmpty(author) && pathname === "/Chat") {
      router.push("/Dashboard");
    } else if (!isObjectEmpty(author) && pathname === "/Dashboard") {
      router.replace("/Chat");
    }
  }, [author, pathname, router]);

  // Prevent rendering the component if redirection is needed
  if (
    (isObjectEmpty(author) && pathname === "/Chat") ||
    (!isObjectEmpty(author) && pathname === "/Dashboard")
  ) {
    return null;
  }

  return (
    <div className="flex flex-col p-2 w-64 bg-white dark:bg-gray-900 flex-shrink-0 min-h-screen">
      <UserProfile author={author} groupName={groupName} active={false} />
      <ConversationList
        title="Users Online"
        count={onlineUsers?.length ?? 0}
        onlineUsers={onlineUsers}
      />
    </div>
  );
};

export default ChatSideBar;
