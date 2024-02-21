import { useEffect, useState, useMemo, useRef } from "react";
import { IoSearch, IoSend } from "react-icons/io5";
import { GrClose } from "react-icons/gr";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AdvancedImage,
  responsive,
  placeholder,
  accessibility,
  lazyload,
} from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import CloudinaryUploadWidget from "../../utils/CloudinaryUploadWidget";
import ReceivedMessage from "./components/ReceivedMessage";
import SendMessage from "./components/SendMessage";
import ChatNavBar from "../../components/ChatNavBar";
import ScrollToBottom from "react-scroll-to-bottom";
import { fill } from "@cloudinary/url-gen/actions/resize";
import {
  blackwhite,
  sepia,
  grayscale,
} from "@cloudinary/url-gen/actions/effect";

import { source } from "@cloudinary/url-gen/actions/overlay";
import { byAngle } from "@cloudinary/url-gen/actions/rotate";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { backgroundRemoval } from "@cloudinary/url-gen/actions/effect";

// Import required values.
import { text } from "@cloudinary/url-gen/qualifiers/source";
import { Position } from "@cloudinary/url-gen/qualifiers/position";
import { TextStyle } from "@cloudinary/url-gen/qualifiers/textStyle";
import { compass } from "@cloudinary/url-gen/qualifiers/gravity";
import { blur } from "@cloudinary/url-gen/actions/effect";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { png } from "@cloudinary/url-gen/qualifiers/format";
import { autoEco } from "@cloudinary/url-gen/qualifiers/quality";

const ChatRoom = ({ socket }) => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(import.meta.env.VITE_BACKEND_URL);
  // author: author, roomId, onlineUsers: onlineUsers
  const { author, room, onlineUsers, databaseMessages } = location?.state;
  const userName = author?.userName;
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState(databaseMessages || []);
  const [users, setUsers] = useState(onlineUsers || []);
  const [roomData, setRoomData] = useState({
    roomName: room.roomName,
    roomType: "room",
    _id: room._id,
    id: room.roomId,
  });
  const [radius, setRadius] = useState(0);
  const [angle, setAngle] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [publicId, setPublicId] = useState(null);
  const [cloudName] = useState(import.meta.env.VITE_CLOUD_NAME);
  const [uploadPreset] = useState(import.meta.env.VITE_UPLOAD_PRESET);
  const [overlayText, setOverlayText] = useState("");
  const [font, setFont] = useState("arial");
  const [fontSize, setFontSize] = useState(80);
  const [fontWeight, setFontWeight] = useState("");
  const [fontStyle, setFontStyle] = useState("");
  const [textDecoration, setTextDecoration] = useState("");
  const [textAlignment, setTextAlignment] = useState("center");
  const [textColor, setTextColor] = useState("#000000");
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [effect, setEffect] = useState("");

  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [backgroundRemovalFlag, setBackgroundRemovalFlag] = useState(false);

  const handleBackgroundRemovalChange = (event) => {
    setBackgroundRemovalFlag(event.target.value === "true");
  };

  const handleBackgroundColorChange = (event) => {
    setBackgroundColor(event.target.value);
  };
  const handleRadiusChange = (event) => {
    setRadius(Number(event.target.value));
  };

  const handleAngleChange = (event) => {
    setAngle(Number(event.target.value));
  };

  const deleteImage = () => {
    if (publicId) {
      // Call the Cloudinary API or your preferred method to delete the image
      console.log(`Deleting image with publicId: ${publicId}`);
      // Example using Cloudinary API
      // cloudinary.uploader.destroy(publicId, (result) => {
      //   console.log(result);
      // });
    }
    closeFilePreview();
  };

  
  const [uwConfig] = useState({
    cloudName,
    uploadPreset,
    cropping: true, //add a cropping step
    multiple: false, //restrict upload to a single file
    folder: "RealTimeChatApp", //upload files to the specified folder
  });

  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  const memoizedSocket = useMemo(() => socket, [socket]);

  const removeUserFromRoom = async () => {
    socket.emit("offline");
    return navigate("/");
  };

  const closeFilePreview = () => {
    setPublicId(null);
    setRadius(0);
    setAngle(0);
    setOverlayText("");
    setFont("arial");
    setFontSize(80);
    setFontWeight("");
    setFontStyle("");
    setTextDecoration("");
    setTextAlignment("center");
    setTextColor("#000000");
    setOffsetX(0);
    setOffsetY(0);
    setEffect("");
    setBackgroundRemovalFlag(false);
    setBackgroundColor("#ffffff");
  };

  const handleEffectChange = (e) => {
    setEffect(e.target.value);
  };

  const handleTextAlignmentChange = (e) => {
    setTextAlignment(e.target.value);
  };

  const handleSendMessage = async () => {
    const disconnectedAlert =
      "You have been disconnected. Please remove this room and join again";

    if (!memoizedSocket.connected || !userName || !room || !roomData.roomType) {
      return alert(disconnectedAlert);
    }

    const isFile = !!publicId;
    let messageContent = currentMessage;
    if (isFile) {
      messageContent = cld
        .image(publicId)
        .effect(backgroundRemovalFlag ? backgroundRemoval() : "")
        .backgroundColor(!!backgroundColor ? backgroundColor : "")
        .overlay(
          shouldApplyTextOverlay
            ? source(
                text(
                  overlayText,
                  new TextStyle(font, fontSize > 2 ? fontSize : 2)
                    .fontWeight(fontWeight)
                    .fontStyle(fontStyle)
                    .textDecoration(textDecoration)
                    .textAlignment(textAlignment)
                ).textColor(textColor)
              ).position(
                new Position()
                  .gravity(compass(textAlignment))
                  .offsetX(offsetX)
                  .offsetY(offsetY)
              )
            : ""
        )
        .effect(
          effect === "blackwhite"
            ? blackwhite()
            : effect === "Sepia"
            ? sepia()
            : effect === "GrayScale"
            ? grayscale()
            : blur().strength(1)
        )
        .roundCorners(byRadius(radius))
        .rotate(byAngle(angle))
        .resize(fill().width(250).height(250))
        .delivery(quality(autoEco()))
        .delivery(format(png()))
        .toURL();
    }

    // const messageContent = isFile ? filePreview : currentMessage;
    console.log("messageContent", messageContent);
    const messageData = {
      author,
      isFile,
      message: messageContent,
      timeStamp: new Date().toISOString(),
      room,
      isRoom: roomData.roomType === "personal" ? false : true,
      receiver:
        roomData.roomType === "personal"
          ? {
              userName: roomData.roomName,
              _id: roomData._id,
              socketId: roomData.id,
            }
          : null,
    };
    console.log("messageData", messageData);

    memoizedSocket.emit("send_message", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    closeFilePreview();
    setCurrentMessage("");
  };

  const handleReceiveMessage = (messageData) => {
    console.log("Message Received", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
  };

  const handleUserClick = (user) => {
    if (roomData.roomName === user.userName) return;
    if (user.userName === userName) return;
    setRoomData({
      roomName: user.userName,
      roomType: "personal",
      _id: user._id,
      id: user.socketId,
    });
  };

  const handleRoomClick = () => {
    if (roomData.id === room.roomId) return;
    setRoomData({
      roomName: room.roomName,
      roomType: "room",
      id: room.roomId,
      _id: room._id,
    });
  };

  const shouldApplyTextOverlay = overlayText.trim() !== "";

  useEffect(() => {
    // Emit the "checkUserInRoom" event to the server
    socket.emit("checkUserInRoom", { roomId: room.roomId }, ({ success }) => {
      if (success) {
        // User is in the room, you can load the component or perform other actions
        console.log("User is in the room");
      } else {
        // User is not in the room, show an alert and navigate to "/"
        alert("User is not in the room");
        navigate("/");
      }
    });
  }, [socket, room, navigate]);

  useEffect(() => {
    memoizedSocket.on("receive_message", handleReceiveMessage);

    memoizedSocket.on("disconnecting", (reason) => {
      alert(`${reason} been disconnected`);
    });
    return () => {
      memoizedSocket.off("receive_message");
      memoizedSocket.off("user_join");
    };
  }, [memoizedSocket, users]);

  useEffect(() => {
    socket.on("user-disconnected", ({ userName, users }) => {
      console.log("user-disconnected", userName, users);
      setUsers(users);
      alert(`${userName} has been disconnected`);
    });
    socket.on("user-offline", ({ userName, users }) => {
      console.log("user-disconnected", userName, users);
      setUsers(users);
      alert(`${userName} has gone offline`);
    });
    socket.on("user-joined", (user) => {
      setUsers((prevUsers) => [...prevUsers, user]);
    });

    return () => {
      socket.off("user-disconnected");
      socket.off("user-offline");
      socket.off("user-joined");
    };
  }, [socket, users]);

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
                  onClick={() => handleRoomClick()}
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
                  <span className="ms-3">Room : {room.roomName}</span>
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
                users?.map((user) => (
                  <li className="ml-6">
                    <div
                      className={`flex items-center p-2 text-gray-900 rounded-lg group ${
                        user.userName === userName
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
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <IoSearch className="h-[28px] w-[28px] cursor-pointer text-gray-500" />
                    <CloudinaryUploadWidget
                      uwConfig={uwConfig}
                      setPublicId={setPublicId}
                    />

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
                <ScrollToBottom className="flex-1 bg-[#DAD3CC] overscroll-y-scroll max-h-[28rem]">
                  <div className="py-2 px-3">
                    {messages &&
                      messages.map((message, index) => (
                        <div key={index}>
                          {roomData.roomType === "room" ? (
                            message.isRoom ? (
                              message?.author?.userName === userName ? (
                                <SendMessage
                                  message={message.message}
                                  timestamp={message.timeStamp}
                                  isFile={message.isFile}
                                />
                              ) : (
                                <ReceivedMessage
                                  isFile={message.isFile}
                                  message={message.message}
                                  sender={message.author.userName}
                                  timestamp={message.timeStamp}
                                />
                              )
                            ) : null
                          ) : (
                            !message.isRoom &&
                            (message.author.userName === roomData.roomName ||
                              message.receiver.userName ===
                                roomData.roomName) && (
                              <>
                                {message?.author?.userName === userName ? (
                                  <SendMessage
                                    isFile={message.isFile}
                                    message={message.message}
                                    timestamp={message.timeStamp}
                                  />
                                ) : (
                                  <ReceivedMessage
                                    isFile={message.isFile}
                                    message={message.message}
                                    sender={message.author.userName}
                                    timestamp={message.timeStamp}
                                  />
                                )}
                              </>
                            )
                          )}
                        </div>
                      ))}
                    {!messages ||
                      (messages.length === 0 && (
                        <div>No messages for this room</div>
                      ))}
                  </div>
                  {!!publicId && (
                    <div className="mb-2 py-2 px-3 relative">
                      <GrClose
                        className="h-6 w-6 cursor-pointer absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={closeFilePreview}
                      />
                      <div className="mb-2">
                        <label htmlFor="text">Text Content:</label>
                        <input
                          type="text"
                          id="text"
                          name="text"
                          value={overlayText}
                          onChange={(e) => setOverlayText(e.target.value)}
                        />
                      </div>

                      {shouldApplyTextOverlay && (
                        <>
                          <div className="mb-2">
                            <label htmlFor="font">Font:</label>
                            <select
                              id="font"
                              name="font"
                              value={font}
                              onChange={(e) => setFont(e.target.value)}
                            >
                              <option value="arial">Arial</option>
                              <option value="courier new">Courier New</option>
                              <option value="georgia">Georgia</option>
                              <option value="roboto">Roboto</option>
                              <option value="times new roman">
                                Times New Roman
                              </option>
                            </select>
                          </div>
                          <div className="mb-2">
                            <label htmlFor="fontSize">Font Size:</label>
                            <input
                              type="number"
                              id="fontSize"
                              name="fontSize"
                              value={fontSize}
                              onChange={(e) =>
                                setFontSize(Number(e.target.value))
                              }
                            />
                          </div>
                          <div className="mb-2">
                            <label htmlFor="fontWeight">Font Weight:</label>
                            <select
                              id="fontWeight"
                              name="fontWeight"
                              value={fontWeight}
                              onChange={(e) => setFontWeight(e.target.value)}
                            >
                              <option value="">Normal</option>
                              <option value="bold">Bold</option>
                            </select>
                          </div>
                          <div className="mb-2">
                            <label htmlFor="fontStyle">Font Style:</label>
                            <select
                              id="fontStyle"
                              name="fontStyle"
                              value={fontStyle}
                              onChange={(e) => setFontStyle(e.target.value)}
                            >
                              <option value="">Normal</option>
                              <option value="italic">Italic</option>
                            </select>
                          </div>
                          <div className="mb-2">
                            <label htmlFor="textDecoration">
                              Text Decoration:
                            </label>
                            <select
                              id="textDecoration"
                              name="textDecoration"
                              value={textDecoration}
                              onChange={(e) =>
                                setTextDecoration(e.target.value)
                              }
                            >
                              <option value="">None</option>
                              <option value="underline">Underline</option>
                            </select>
                          </div>
                          <div className="mb-2">
                            <label htmlFor="textAlignment">
                              Text Alignment:
                            </label>
                            <select
                              id="textAlignment"
                              name="textAlignment"
                              value={textAlignment}
                              onChange={handleTextAlignmentChange}
                            >
                              <option value="center">Center</option>
                              <option value="north">Up</option>
                              <option value="south">Down</option>
                              <option value="east">Right</option>
                              <option value="west">Left</option>
                              <option value="northeast">Upper Right</option>
                              <option value="northwest">Upper Left</option>
                              <option value="southeast">Lower Right</option>
                              <option value="southwest">Lower Left</option>
                            </select>
                          </div>

                          <div className="mb-2">
                            <label htmlFor="textColor">Text Color:</label>
                            <input
                              type="color"
                              id="textColor"
                              name="textColor"
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                            />
                          </div>
                          <div className="mb-2">
                            <label htmlFor="offsetX">Offset X:</label>
                            <input
                              type="number"
                              id="offsetX"
                              name="offsetX"
                              value={offsetX}
                              onChange={(e) =>
                                setOffsetX(Number(e.target.value))
                              }
                            />
                          </div>
                          <div className="mb-2">
                            <label htmlFor="offsetY">Offset Y:</label>
                            <input
                              type="number"
                              id="offsetY"
                              name="offsetY"
                              value={offsetY}
                              onChange={(e) =>
                                setOffsetY(Number(e.target.value))
                              }
                            />
                          </div>
                        </>
                      )}
                      <>
                        <div className="mb-2">
                          <label>
                            <input
                              type="radio"
                              value="false"
                              checked={!backgroundRemovalFlag}
                              onChange={handleBackgroundRemovalChange}
                            />
                            No Background Removal
                          </label>
                        </div>

                        <div className="mb-2">
                          <label>
                            <input
                              type="radio"
                              value="true"
                              checked={backgroundRemovalFlag}
                              onChange={handleBackgroundRemovalChange}
                            />
                            Background Removal
                          </label>
                        </div>

                        {!!backgroundRemovalFlag && (
                          <div className="mb-2">
                            <label>
                              Background Color:
                              <input
                                type="color"
                                value={backgroundColor}
                                onChange={handleBackgroundColorChange}
                              />
                            </label>
                          </div>
                        )}
                      </>

                      <div>
                        <div className="mb-2">
                          <label>Effect:</label>
                          <select value={effect} onChange={handleEffectChange}>
                            <option value="">None</option>
                            <option value="blackwhite">Black & white</option>
                            <option value="Sepia">Sepia</option>
                            <option value="GrayScale">GrayScale</option>
                          </select>
                        </div>
                      </div>
                      <div className="mb-2">
                        <label htmlFor="radius">Radius:</label>
                        <input
                          type="range"
                          id="radius"
                          name="radius"
                          min="0"
                          max="100"
                          step="1"
                          value={radius}
                          onChange={handleRadiusChange}
                        />
                        <span>{radius}</span>
                      </div>
                      <div className="mb-2">
                        <label htmlFor="angle">Angle:</label>
                        <input
                          type="range"
                          id="angle"
                          name="angle"
                          min="0"
                          max="360"
                          step="1"
                          value={angle}
                          onChange={handleAngleChange}
                        />
                        <span>{angle}</span>
                      </div>

                      <AdvancedImage
                        style={{
                          height: "12rem",
                          width: "auto",
                        }}
                        cldImg={cld
                          .image(publicId)
                          .effect(
                            backgroundRemovalFlag ? backgroundRemoval() : ""
                          )
                          .backgroundColor(
                            !!backgroundColor ? backgroundColor : ""
                          )
                          .overlay(
                            shouldApplyTextOverlay
                              ? source(
                                  text(
                                    overlayText,
                                    new TextStyle(
                                      font,
                                      fontSize > 2 ? fontSize : 2
                                    )
                                      .fontWeight(fontWeight)
                                      .fontStyle(fontStyle)
                                      .textDecoration(textDecoration)
                                      .textAlignment(textAlignment)
                                  ).textColor(textColor)
                                ).position(
                                  new Position()
                                    .gravity(compass(textAlignment))
                                    .offsetX(offsetX)
                                    .offsetY(offsetY)
                                )
                              : ""
                          )
                          .effect(
                            effect === "blackwhite"
                              ? blackwhite()
                              : effect === "Sepia"
                              ? sepia()
                              : effect === "GrayScale"
                              ? grayscale()
                              : blur().strength(1)
                          )
                          .roundCorners(byRadius(radius))
                          .rotate(byAngle(angle))
                          .delivery(quality(autoEco()))
                          .delivery(format(png()))}
                        plugins={[
                          lazyload({ rootMargin: "0px", threshold: 0.25 }),
                          responsive({
                            steps: 200,
                          }),
                          placeholder({ mode: "pixelate" }),
                        ]}
                      />
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={deleteImage}
                      >
                        Delete Image
                      </button>
                    </div>
                  )}
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
