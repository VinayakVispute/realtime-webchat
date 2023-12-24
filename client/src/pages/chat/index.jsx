import { useEffect, useState, useMemo } from "react";
import { IoSearch, IoSend } from "react-icons/io5";
import { GrAttachment } from "react-icons/gr";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import ReceivedMessage from "./components/ReceivedMessage";
import SendMessage from "./components/SendMessage";
import ChatNavBar from "../../components/ChatNavBar";
import ScrollToBottom from "react-scroll-to-bottom";
const ChatRoom = ({ socket }) => {
  const location = useLocation();
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { username, roomId } = location?.state;

  const memoizedSocket = useMemo(() => socket, [socket]);

  const handleSendMessage = async () => {
    if (currentMessage.trim() !== "") {
      const messageData = {
        roomId,
        author: username,
        message: currentMessage,
        timeStamp: new Date(),
      };
      await memoizedSocket.emit("send_message", messageData);
      // setMessages((prevMessages) => [...prevMessages, messageData]);
      setCurrentMessage("");
      console.log("sent message");
    }
  };

  // const handleSendMessageScript = async (messageCurrent) => {
  //   const messageData = {
  //     roomId,
  //     author: username,
  //     message: messageCurrent,
  //     timeStamp: new Date().toISOString(),
  //   };
  //   await memoizedSocket.emit("send_message", messageData);
  //   // setMessages((prevMessages) => [...prevMessages, messageData]);
  //   console.log("sendmessgescript");
  //   setCurrentMessage("");
  //   console.log("sent message");
  // };
  const handleReceiveMessage = (messageData) => {
    console.log(messageData);
    if (messageData.roomId !== roomId) return;
    setMessages((prevMessages) => [...prevMessages, messageData]);
    console.log("messageData", messageData);
  };

  useEffect(() => {
    console.log("useEffect");
    memoizedSocket.on("receive_message", handleReceiveMessage);
    return () => {
      memoizedSocket.removeListener("receive_message");
    };
  }, [memoizedSocket]);

  return (
    <div className="flex flex-col h-screen">
      <ChatNavBar />
      <div className="flex border border-grey rounded shadow-lg flex-1">
        <div className="min-w-full border flex flex-col">
          <div className="py-2 px-3 bg-grey-lighter flex justify-between items-center">
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded-full"
                src="profilePhoto.jpeg"
                alt="Profile"
              />
              <div className="ml-4">
                <p className="text-grey-darkest">{roomId}</p>
                <p className="text-grey-darker text-xs mt-1">
                  Andrés, Tom, Harrison, Arnold, Sylvester - Dummy Names
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <IoSearch className="h-[28px] w-[28px] cursor-pointer text-gray-500" />
              <GrAttachment className="h-[28px] w-[28px] cursor-pointer text-gray-500" />
              <BsThreeDotsVertical className="h-[28px] w-[28px] cursor-pointer text-gray-500" />
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-[#DAD3CC]">
            <div className="py-2 px-3 min-h-[35rem]">
              <ScrollToBottom>
                {messages.map((message, index) => (
                  <div key={index}>
                    {message.author === username ? (
                      <SendMessage
                        message={message.message}
                        timestamp={message.timeStamp}
                      />
                    ) : (
                      <>
                        <ReceivedMessage
                          message={message.message}
                          sender={message.author}
                          timestamp={message.timeStamp}
                        />
                      </>
                    )}
                  </div>
                ))}
              </ScrollToBottom>
            </div>
          </div>
          <div className="bg-grey-lighter px-4 py-4 flex items-center">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
              >
                {/* Your SVG path here */}
              </svg>
            </div>
            <div className="flex-1 mx-4 min-h-10">
              <input
                onKeyUp={(e) => {
                  e.key === "Enter" && handleSendMessage();
                }}
                className="w-full border rounded px-2 py-2"
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
              />
            </div>
            <IoSend
              className="h-[24px] w-[24px] cursor-pointer text-gray-500"
              onClick={() => {
                for (let i = 0; i < 100; i++) {
                  console.log(i);
                  handleSendMessageScript(i);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
