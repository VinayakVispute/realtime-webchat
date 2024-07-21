"use client";
import { ChatState, ChatStateInterface } from "@/interfaces";
import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useEffect,
} from "react";
import { useSocket } from "./SocketProvider";

// Define action types
type Action =
  | { type: "SET_AUTHOR"; payload: ChatStateInterface["author"] }
  | { type: "SET_GROUP_DETAILS"; payload: ChatStateInterface["groupDetails"] }
  | { type: "SET_MESSAGES"; payload: ChatStateInterface["messages"] }
  | { type: "SET_ONLINE_USERS"; payload: ChatStateInterface["onlineUsers"] }
  | { type: "ADD_MESSAGE"; payload: ChatStateInterface["messages"] }
  | {
      type: "ADD_CURRENT_ACTIVE_USER";
      payload: ChatStateInterface["currentActiveUser"];
    };
// Initial state
const initialState: ChatState = {
  author: {},
  groupDetails: {},
  messages: [],
  onlineUsers: [],
  currentActiveUser: {},
};

// Reducer function
const reducer = (state: ChatState, action: Action): ChatState => {
  switch (action.type) {
    case "SET_AUTHOR":
      return { ...state, author: action.payload };
    case "SET_GROUP_DETAILS":
      return { ...state, groupDetails: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "SET_ONLINE_USERS":
      return { ...state, onlineUsers: action.payload };
    case "ADD_CURRENT_ACTIVE_USER":
      return { ...state, currentActiveUser: action.payload };
    case "ADD_MESSAGE":
      let newMessages;
      if (Array.isArray(action.payload)) {
        newMessages = [...state.messages, ...action.payload];
      } else {
        newMessages = [...state.messages, action.payload];
      }
      return { ...state, messages: newMessages };
    default:
      return state;
  }
};

// Create context
const ChatContext = createContext<
  { state: ChatState; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

// ChatProvider component
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { socket } = useSocket();

  const handleReceiveMessage = (
    messageData: ChatStateInterface["messages"]
  ) => {
    dispatch({ type: "ADD_MESSAGE", payload: messageData });
  };

  const userDisconnect = ({
    userName,
    users,
  }: {
    userName: string;
    users: ChatStateInterface["onlineUsers"];
  }) => {
    dispatch({ type: "SET_ONLINE_USERS", payload: users });
    //TODO: add a toast notification
  };

  const userJoined = ({
    userName,
    users,
  }: {
    userName: string;
    users: ChatStateInterface["onlineUsers"];
  }) => {
    dispatch({ type: "SET_ONLINE_USERS", payload: users });
    // TODO : add a toast notification
  };

  useEffect(() => {
    if (socket) {
      console.log("Socket Connected UseEffect");
      socket.on("receive_message", handleReceiveMessage);
      socket.on("user-disconnected", userDisconnect);
      socket.on("user-joined", userJoined);
    }

    return () => {
      socket?.off("receive_message", handleReceiveMessage);
      socket?.off("user-disconnected", userDisconnect);
      socket?.off("user-joined", userJoined);
    };
  }, [socket]);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

// useChat hook
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
