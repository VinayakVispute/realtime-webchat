"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  SendHorizonal,
  Paperclip,
  Image,
  FileText,
  Video,
  Smile,
} from "lucide-react";
import { useState } from "react";
import { useSocket } from "@/context/SocketProvider";
import { IChatLowerBarParams, IGroup } from "@/interfaces";
import { useChat } from "@/context/ChatProvider";

const ChatLowerBar = ({ userName }: IChatLowerBarParams) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const { state, dispatch } = useChat();
  const { currentActiveUser, groupDetails, author } = state;
  const { socket } = useSocket();
  const handleSendMessage = () => {
    if (
      !socket?.connected ||
      !userName ||
      !currentActiveUser ||
      !currentActiveUser.groupType
    ) {
      console.log("Socket not connected");
      return;
    }
    if (!currentMessage) {
      return;
    }
    console.log("This is state", state);
    const messageData = {
      author,
      isFile: false,
      message: currentMessage,
      timestamp: new Date().toISOString(),
      group: groupDetails,
      isGroup: currentActiveUser.groupType === "group",
      receiver:
        currentActiveUser.groupType === "personal"
          ? {
              userName: currentActiveUser.groupName,
              _id: currentActiveUser._id, //TODO : check here IMP
              socketId: currentActiveUser.groupId,
            }
          : null,
    };
    console.log("This is message data", messageData);
    socket.emit("send_message", messageData);
    //@ts-ignore
    console.log("Dispatch");
    dispatch({ type: "ADD_MESSAGE", payload: messageData });

    setCurrentMessage("");
  };
  return (
    <div className="flex items-center h-16 rounded-xl bg-white dark:bg-gray-800 w-full px-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <Command>
            <CommandInput placeholder="Select option..." />
            <CommandList>
              <CommandItem>
                <Image className="mr-2 h-4 w-4" /> Images
              </CommandItem>
              <CommandItem>
                <FileText className="mr-2 h-4 w-4" /> Documents
              </CommandItem>
              <CommandItem>
                <Video className="mr-2 h-4 w-4" /> Videos
              </CommandItem>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        onKeyUp={(e) => {
          e.key === "Enter" && handleSendMessage();
        }}
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        placeholder="Type a message"
        className="flex-grow ml-4 border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10 bg-white dark:bg-gray-700 dark:border-gray-600"
      />

      <Button className="ml-4 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
        <span>Send</span>
        <SendHorizonal className="w-4 h-4 ml-2 -mt-px" />
      </Button>
      <Smile className="w-8 h-8 ml-2 -mt-px" />
    </div>
  );
};

export default ChatLowerBar;
