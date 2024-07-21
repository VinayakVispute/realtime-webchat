"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChatAvatars from "./ChatAvatars";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  IoEllipsisHorizontal,
  IoOpenOutline,
  IoExitOutline,
  IoShareOutline,
} from "react-icons/io5";
import {
  ChatTableParamsInterface,
  handleJoinGroupParamsInterface,
  handleRemoveGroupParamsInterface,
} from "@/interfaces";
import { useSocket } from "@/context/SocketProvider";
import { useChat } from "@/context/ChatProvider";
import { useRouter } from "next/navigation";
import { removeGroup } from "@/lib/actions/group.actions";

const ChatTable: React.FC<ChatTableParamsInterface> = ({
  totalGroups,
  totalMembersPerGroup,
  userName,
  mongoDbId,
}) => {
  const { socket } = useSocket();
  const { dispatch } = useChat();
  const router = useRouter();
  const handleJoinGroup = ({
    groupId,
    socketId,
    userName,
  }: handleJoinGroupParamsInterface) => {
    if (!socket) {
      console.error("Socket is not available");
      return;
    }
    if (!socket.connected) {
      console.error("Socket is not connected");
      return;
    }
    if (groupId === "" || socketId === "" || userName === "") {
      console.error("Invalid parameters");
      return;
    }
    socket.emit("join_group", { groupId, socketId, userName }, (response) => {
      if (!response.success) {
        console.error(response.message);
        // TODO:Leave the group if the user is already in the group
        return;
      }
      const { data } = response;
      dispatch({ type: "SET_AUTHOR", payload: data.author });
      dispatch({ type: "SET_GROUP_DETAILS", payload: data.group });
      dispatch({
        type: "ADD_CURRENT_ACTIVE_USER",
        payload: {
          groupType: "group",
          ...data.group,
        },
      });
      dispatch({ type: "SET_MESSAGES", payload: data.messages });
      dispatch({ type: "SET_ONLINE_USERS", payload: data.onlineUsers });
      console.log("Joined group Successfully");
      router.push(`/Chat`);
      return;
    });
  };
  const handleLeaveGroup = async ({
    groupId,
  }: handleRemoveGroupParamsInterface) => {
    const response = await removeGroup({ groupId, mongoDbId });
    if (!response.success) {
      console.error(response.message);
      return;
    }
    console.log("Left group successfully");
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">No. of Groups: {totalGroups}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Chat Name</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Avatars</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {totalMembersPerGroup.map((chat) => (
            <TableRow key={chat._id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={chat.groupPic} alt={chat.groupName} />
                    <AvatarFallback>
                      {chat?.groupName?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{chat.groupName}</span>
                </div>
              </TableCell>
              <TableCell>{chat.totalMembers}</TableCell>
              <TableCell>
                {/* @ts-ignore */}
                <ChatAvatars avatars={chat.members} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <IoEllipsisHorizontal
                      className="cursor-pointer"
                      size={20}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        handleJoinGroup({
                          groupId: chat.groupId || "",
                          socketId: socket?.id || "",
                          userName: userName,
                        })
                      }
                    >
                      <IoOpenOutline className="mr-2" size={16} /> Open
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleLeaveGroup({
                          groupId: chat.groupId || "",
                        })
                      }
                    >
                      <IoExitOutline className="mr-2" size={16} /> Leave
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IoShareOutline className="mr-2" size={16} /> Share
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ChatTable;
