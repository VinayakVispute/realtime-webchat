import ChatLowerBar from "@/components/shared/Chat/ChatLowerBar";
import ChatNavbar from "@/components/shared/Chat/ChatNavBar";
import ChatSideBar from "@/components/shared/Chat/ChatSideBar";
import MessagesScrollArea from "@/components/shared/Chat/MessagesScrollArea";
import { currentUser } from "@clerk/nextjs/server";

const Chat = async () => {
  const user: any = await currentUser();

  return (
    <div className="min-h-screen flex text-gray-800 dark:text-gray-100 overflow-y-hidden">
      <ChatSideBar />
      <div className="flex flex-col flex-auto bg-gray-50 dark:bg-gray-900 p-3">
        <div className="flex flex-col flex-auto mb-4 overflow-x-hidden rounded-2xl bg-white dark:bg-gray-800">
          <ChatNavbar />
          <MessagesScrollArea />
          <ChatLowerBar userName={user.username} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
