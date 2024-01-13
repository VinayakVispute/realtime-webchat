import { useEffect, useState, useMemo, useRef } from "react";
import { IoSearch, IoSend } from "react-icons/io5";
import { GrAttachment } from "react-icons/gr";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import ReceivedMessage from "./components/ReceivedMessage";
import SendMessage from "./components/SendMessage";
import ChatNavBar from "../../components/ChatNavBar";
import ScrollToBottom from "react-scroll-to-bottom";

const ChatRoom = ({ socket, messagesData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, roomId, messagefromDatabaseForRoom } = location?.state;
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState(
    { [roomId]: messagefromDatabaseForRoom } || {}
  );
  const [users, setUsers] = useState([]);
  const [roomData, setRoomData] = useState({
    roomName: roomId,
    roomType: "room",
    id: roomId,
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const memoizedSocket = useMemo(() => socket, [socket]);
  console.log("socket", socket);
  const removeUserFromRoom = async () => {
    await memoizedSocket.emit("leave_room", roomId);
    return navigate("/");
  };
  const handleSendMessage = async () => {
    const disconnectedAlert =
      "You have been disconnected. Please remove this room and join again";

    if (
      !memoizedSocket.connected ||
      !username ||
      !roomId ||
      !roomData.roomType
    ) {
      return alert(disconnectedAlert);
    }

    const messageData = {
      author: username,
      message: currentMessage,
      timeStamp: new Date().toISOString(),
    };

    if (roomData.roomType === "personal") {
      messageData.isRoom = false;
      messageData.receiver = roomData.roomName;
    } else if (roomData.roomType === "room") {
      messageData.isRoom = true;
      messageData.receiver = roomId;
    } else {
      return alert(disconnectedAlert);
    }
    console.log("messageData before emiting", messageData);
    await memoizedSocket.emit("send_message", {
      messageData,
      senderData: roomData.id,
    });

    setCurrentMessage("");

    if (!messageData.isRoom) {
      const key = messageData.receiver;
      if (messages.hasOwnProperty(key)) {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [key]: [...prevMessages[key], messageData],
        }));
      } else {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [key]: [messageData],
        }));

        console.log("sent message");
      }
    }
  };
  // const handleReceiveMessage = (messageData) => {
  //   console.log(messageData);
  //   // if (messageData.roomId !== roomId) return;
  //   setMessages((prevMessages) => [...prevMessages, messageData]);
  //   console.log("messageData", messageData);
  // };

  // const handleReceiveMessage = (messageData) => {
  //   // Assuming you have a state variable like roomsMessages which is an object with roomIds as keys and message arrays as values
  //   console.log("Message Received", messageData);
  //   setMessages((prevMessages) => {
  //     const { receiver } = messageData;

  //     // Check if array for the room already exists
  //     if (prevMessages.hasOwnProperty(receiver)) {
  //       // Room array exists, push the message
  //       return {
  //         ...prevMessages,
  //         [receiver]: [...prevMessages[receiver], messageData],
  //       };
  //     } else {
  //       // Room array doesn't exist, create a new array and push the message
  //       return {
  //         ...prevMessages,
  //         [receiver]: [messageData],
  //       };
  //     }
  //   });
  // };

  const handleReceiveMessage = (messageData) => {
    console.log("Message Received", messageData);
    setMessages((prevMessages) => {
      if (messageData.isRoom) {
        // It's a room, check for roomId
        const { receiver } = messageData;

        // Check if the room array already exists
        if (prevMessages.hasOwnProperty(receiver)) {
          // Room array exists, push the message
          return {
            ...prevMessages,
            [receiver]: [...prevMessages[receiver], messageData],
          };
        } else {
          // Room array doesn't exist, create a new array
          return {
            ...prevMessages,
            [receiver]: [messageData],
          };
        }
      } else {
        // Not a room, treat it as a message between sender and receiver
        const { author, receiver } = messageData;

        // Update sender's array
        const updatedAuthorMessages = prevMessages.hasOwnProperty(author)
          ? { [author]: [...prevMessages[author], messageData] }
          : { [author]: [messageData] };

        // Update receiver's array
        const updatedReceiverMessages = prevMessages.hasOwnProperty(receiver)
          ? { [receiver]: [...prevMessages[receiver], messageData] }
          : { [receiver]: [messageData] };

        // Return the combined updated state
        return {
          ...prevMessages,
          ...updatedAuthorMessages,
          ...updatedReceiverMessages,
        };
      }
    });
  };

  const handleUserClick = (user) => {
    if (roomData.roomName === user.userName) return;

    if (user.userName === username) return;
    if (!messages.hasOwnProperty(user.userName)) {
      console.log("get_messages_from_database");
      socket.emit(
        "get_messages_from_database",
        {
          roomName: user.userName,
          userName: username,
        },
        (messagesforUserFromDatabase) => {
          setMessages((prevMessages) => {
            return {
              ...prevMessages,
              [user.userName]: messagesforUserFromDatabase,
            };
          });
        }
      );
    }
    setRoomData({
      roomName: user.userName,
      roomType: "personal",
      id: user.socketId,
    });
  };

  const handleRoomClick = () => {
    if (roomData.roomName === roomId) return;
    setRoomData({
      roomName: roomId,
      roomType: "room",
      id: roomId,
    });
  };

  useEffect(() => {
    memoizedSocket.on("receive_message", handleReceiveMessage);
    memoizedSocket.on("user_join", (user) => {
      setUsers(user);
    });
    memoizedSocket.on("disconnecting", (reason) => {
      alert(`${reason} been disconnected`);
    });
    return () => {
      memoizedSocket.removeListener("receive_message");
      memoizedSocket.removeListener("user_join");
    };
  }, [memoizedSocket, users]);

  return (
    <>
      <ChatNavBar />

      <div className="">
        <button
          data-drawer-target="default-sidebar"
          data-drawer-toggle="default-sidebar"
          aria-controls="default-sidebar"
          type="button"
          className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200   d"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            />
          </svg>
        </button>
        <aside
          id="default-sidebar"
          className="fixed top-14 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
          aria-label="Sidebar"
        >
          <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 ">
            <ul className="space-y-2 font-medium">
              <li>
                <div
                  className="flex items-center p-2 text-gray-900 rounded-lg   group cursor-pointer "
                  onClick={() => handleRoomClick(roomId)}
                >
                  <svg
                    className="w-5 h-5 text-gray-500 transition duration-75   "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 21"
                  >
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                  </svg>
                  <span className="ms-3">Room : {roomId}</span>
                </div>
              </li>
              <li className="border-b-4">
                <div className="flex items-center p-2 text-gray-900 rounded-lg    group cursor-default">
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75   "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                  {users.length !== 0 && (
                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full cu  ">
                      {users.length}
                    </span>
                  )}
                </div>
              </li>
              {users &&
                users.map((user) => (
                  <li className="ml-6">
                    <div
                      className={`flex items-center p-2 text-gray-900 rounded-lg group ${
                        user.userName === username
                          ? "cursor-default bg-gray-300"
                          : "cursor-pointer hover:bg-gray-100"
                      }`}
                      onClick={() => handleUserClick(user)}
                    >
                      <svg
                        className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 14 18"
                      >
                        <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                      </svg>

                      <span className="flex-1 ms-3 whitespace-nowrap">
                        {user.userName}
                      </span>
                    </div>
                  </li>
                ))}
              <li className="border-t-4">
                <button
                  onClick={removeUserFromRoom}
                  className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
                >
                  <svg
                    className="w-5 h-5 text-gray-500 transition duration-75   "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="red"
                    viewBox="0 0 20 18"
                  >
                    <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-6a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2Z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap text-red-500">
                    Leave this Room
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </aside>
        <div className=" sm:ml-64">
          <div className="flex flex-col h-screen">
            <div className="flex border border-grey rounded shadow-lg flex-1">
              <div className="min-w-full border flex flex-col flex-1 bg-[#DAD3CC]">
                <div className="py-2 px-3 bg-grey-lighter flex justify-between items-center">
                  <div className="flex items-center">
                    <img
                      className="w-10 h-10 rounded-full"
                      src="profilePhoto.jpeg"
                      alt="Profile"
                    />
                    <div className="ml-4">
                      <p className="text-grey-darkest">{roomData.roomName}</p>
                      <p className="text-grey-darker text-xs mt-1">
                        {users && users.map((user) => user.userName).join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <IoSearch className="h-[28px] w-[28px] cursor-pointer text-gray-500" />
                    <GrAttachment className="h-[28px] w-[28px] cursor-pointer text-gray-500" />
                    <div className="relative inline-block text-left">
                      <BsThreeDotsVertical
                        className="h-[28px] w-[28px] cursor-pointer text-gray-500"
                        onClick={() => setShowDropdown(!showDropdown)}
                      />
                      {showDropdown && (
                        <div className="z-10 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                          <div>
                            <ul
                              className="py-2 text-sm text-gray-700 "
                              aria-labelledby="dropdownDividerButton"
                            >
                              <li>
                                <div
                                  href="#"
                                  className="block px-4 py-2 hover:bg-gray-100"
                                >
                                  Dashboard
                                </div>
                              </li>
                              <li>
                                <div
                                  href="#"
                                  className="block px-4 py-2 hover:bg-gray-100 "
                                >
                                  Settings
                                </div>
                              </li>
                              <li>
                                <div
                                  href="#"
                                  className="block px-4 py-2 hover:bg-gray-100 "
                                >
                                  Earnings
                                </div>
                              </li>
                            </ul>
                            <div className="py-2 border-t-2">
                              <button
                                className="flex items-center p-3 text-sm font-medium text-red-600  border-gray-200 rounded-b-lg bg-gray-50  hover:bg-gray-100  hover:underline cursor-pointer"
                                onClick={removeUserFromRoom}
                              >
                                <svg
                                  className="w-4 h-4 me-2"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 20 18"
                                >
                                  <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-6a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2Z" />
                                </svg>
                                Leave this Room
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <ScrollToBottom className="flex-1  bg-[#DAD3CC] overscroll-y-scroll max-h-[28rem]">
                  <div className="py-2 px-3">
                    {messages[roomData.roomName] &&
                    messages[roomData.roomName].length > 0 ? (
                      messages[roomData.roomName].map((message, index) => (
                        <>
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
                        </>
                      ))
                    ) : (
                      <div>No messages for this room</div>
                    )}
                  </div>
                </ScrollToBottom>
                <footer className=" bg-grey-lighter pb-16 flex items-center mr-4 ">
                  <div className="flex-1 mx-4 min-h-10">
                    <input
                      onKeyUp={(e) => {
                        e.key === "Enter" && handleSendMessage();
                      }}
                      className=" border rounded px-2 py-2 min-w-full"
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Type a message"
                    />
                  </div>
                  <IoSend
                    className="h-[24px] w-[24px] cursor-pointer text-gray-500"
                    onClick={() => {
                      handleSendMessage();
                    }}
                  />
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatRoom;
