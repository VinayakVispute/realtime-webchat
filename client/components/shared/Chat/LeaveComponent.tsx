// LeaveComponent.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useSocket } from "@/context/SocketProvider";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const LeaveComponent = () => {
  const { socket } = useSocket();
  const router = useRouter();
  const handleLeaveGroup = async () => {
    if (!socket) return;
    socket.emit("offline");
    router.push("/Dashboard");
  };
  return (
    <Button
      size="icon"
      className="bg-transparent dark:bg-transparent"
      onClick={handleLeaveGroup}
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
};

export default LeaveComponent;
