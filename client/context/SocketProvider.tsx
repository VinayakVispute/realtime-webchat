"use client";
import { ISocketContext } from "@/interfaces";
import React, { useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

const SocketContext = React.createContext<ISocketContext | undefined>(
  undefined
);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [isSocketInitialized, setIsSocketInitialized] = useState(false);

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    setSocket(_socket);
    setIsSocketInitialized(true);

    return () => {
      _socket.disconnect();
      setSocket(undefined);
      setIsSocketInitialized(false);
    };
  }, []);

  if (!isSocketInitialized) {
    return null; // or you can return a loading spinner or any placeholder
  }

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useSocket must be used within a SocketProvider");
  return context;
};
