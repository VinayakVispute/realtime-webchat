import mongoose from "mongoose";
import { Socket } from "socket.io-client";

export interface userActionInterface {
  clerkId: string;
  name: string;
  userName: string;
  email: string;
  profilePic: string;
}

export interface IUser extends Document {
  clerkId: string;
  name: string;
  userName: string;
  socketId: string;
  profilePic: string;
  joinedGroups: mongoose.Types.ObjectId[];
}
export interface IMessage extends Document {
  isGroup: boolean;
  author: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  group: mongoose.Types.ObjectId;
  isFile: boolean;
  message: string;
  timestamp: Date;
}

export interface IGroup extends Document {
  groupName: string;
  groupId: string;
  onlineUsers: mongoose.Types.ObjectId[];
  members: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
  groupPic: string;
}

export interface SectionHomePageComponent {
  className?: string;
  id?: string;
  crosses?: boolean;
  crossesOffset?: string;
  customPaddings?: string;
  children: React.ReactNode;
}

export interface removeGroupParamsInterface {
  groupId: string;
  mongoDbId: string;
}

export interface createGroupParamsInterface {
  groupName: string;
  groupId: string;
}

export interface DashboardNavBarParams {
  userName: string | null | undefined;
}

export interface getAllGroupsListParamsInterface {
  userId: string;
  page?: number;
  pageSize?: number;
}

export interface ChatTableParamsInterface {
  totalGroups: number;
  totalMembersPerGroup: Partial<
    IGroup & { _id: string; totalMembers: number }
  >[];
  userName: string;
  mongoDbId: string;
}

export interface addUserToGroupParamsInterface {
  groupId: string;
  userName: string;
}

export interface SocketProviderProps {
  children?: React.ReactNode;
}

export interface ISocketContext {
  socket: Socket | undefined;
}

export interface ChatStateInterface {
  author: Partial<IUser>;
  groupDetails: Partial<IGroup>;
  messages: IMessage[] | [];
  onlineUsers: Partial<IUser>[] | [];
  //TODO: Check if this is the correct type
  currentActiveUser: Partial<IGroup> & {
    groupType?: string;
    _id?: string;
  };
}

export interface MessageParamsInterface {
  message: string;
  name: string;
  timestamp: Date;
  isFile: boolean;
}

export interface handleJoinGroupParamsInterface {
  groupId: string;
  socketId: string;
  userName: string;
}

export interface IChatLowerBarParams {
  userName: string;
}

export interface ChatState {
  author: ChatStateInterface["author"];
  groupDetails: ChatStateInterface["groupDetails"] & { _id?: string };
  messages: ChatStateInterface["messages"];
  onlineUsers: ChatStateInterface["onlineUsers"];
  currentActiveUser: ChatStateInterface["currentActiveUser"];
}

export interface handleRemoveGroupParamsInterface {
  groupId: string;
}

export interface actionsResponseInterface {
  success: boolean;
  message: string;
  data?: any;
}
