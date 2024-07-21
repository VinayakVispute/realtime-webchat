import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { avatar } from "@/types";

interface ChatAvatarsProps {
  avatars?: avatar[];
}

const ChatAvatars: React.FC<ChatAvatarsProps> = ({ avatars }) => {
  return (
    <div className="flex -space-x-2">
      {avatars?.map((avatar) => (
        <Image
          key={avatar._id}
          src={avatar.profilePic || ""}
          alt={`avatar ${avatar._id}`}
          width="40"
          height="40"
          className="rounded-full border-2 border-white"
        />
      ))}
    </div>
  );
};

export default ChatAvatars;
