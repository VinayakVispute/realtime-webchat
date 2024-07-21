"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import SendMessage from "@/components/shared/Chat/SendMessage";
import ReceivedMessage from "@/components/shared/Chat/ReceivedMessage";
import { useChat } from "@/context/ChatProvider";

const MessagesScrollArea = () => {
  const { state } = useChat();
  const { author, messages, currentActiveUser } = state;

  return (
    <ScrollArea className="flex flex-col flex-auto overflow-x-hidden mb-4 max-h-[80vh]">
      <div className="grid grid-cols-12 gap-y-2 p-4">
        {messages &&
          messages.map((message, index) => {
            if (currentActiveUser.groupType === "group") {
              if (message.isGroup) {
                if (message.author?.userName === author?.userName) {
                  return (
                    <SendMessage
                      key={index}
                      message={message.message}
                      timestamp={message.timestamp}
                      name={author?.name?.toString() ?? ""}
                    />
                  );
                } else {
                  return (
                    <ReceivedMessage
                      key={index}
                      message={message.message}
                      timestamp={message.timestamp}
                      sender={message.author?.userName?.toString()}
                      isFile={message.isFile}
                    />
                  );
                }
              }
            } else {
              if (
                !message.isGroup &&
                (message.author?.userName === currentActiveUser.groupName ||
                  message.receiver?.userName === currentActiveUser.groupName)
              ) {
                if (message.author?.userName === author?.userName) {
                  return (
                    <SendMessage
                      key={index}
                      message={message.message}
                      timestamp={message.timestamp}
                      name={author?.name?.toString() ?? ""}
                    />
                  );
                } else {
                  return (
                    <ReceivedMessage
                      key={index}
                      message={message.message}
                      timestamp={message.timestamp}
                      sender={message.author?.userName?.toString()}
                      isFile={message.isFile}
                    />
                  );
                }
              }
            }
            return null;
          })}
      </div>
    </ScrollArea>
  );
};

export default MessagesScrollArea;
