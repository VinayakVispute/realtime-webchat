"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useChat } from "@/context/ChatProvider";

const ConversationItem = ({
  name,
  initial,
  profilePic,
  userName,
  socketId,
  userId,
}: {
  name?: string;
  initial?: string;
  profilePic?: string;
  userName?: string;
  socketId?: string;
  userId?: string;
}) => {
  const { state, dispatch } = useChat();
  const { author, groupDetails, currentActiveUser } = state;

  const handleConversationClick = () => {
    if (!socketId || !userName) {
      console.log("No socketId or userName");
      return;
    }
    if (currentActiveUser.groupName === userName) {
      console.log("Already in the conversation");
      return;
    }
    if (userName === author?.userName) {
      console.log("Cannot start conversation with self");
      return;
    }
    console.log("Dispatching ADD_CURRENT_ACTIVE_USER", userId);
    dispatch({
      type: "ADD_CURRENT_ACTIVE_USER",
      payload: {
        ...groupDetails,
        _id: userId,
        groupName: userName,
        groupPic: profilePic,
        groupType: "personal",
        groupId: socketId,
      },
    });
  };

  return (
    <button
      className="flex flex-row items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl w-full p-2"
      onClick={handleConversationClick}
    >
      <Avatar>
        <AvatarImage
          src={profilePic}
          alt={`${name} ?? "User"}'s Profile Image`}
        />
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>
      <div className="ml-2 text-sm font-semibold">{name}</div>

      {/* {unreadCount && (
        <div className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none">
          {unreadCount}
        </div>
      )} */}
    </button>
  );
};

export default ConversationItem;
