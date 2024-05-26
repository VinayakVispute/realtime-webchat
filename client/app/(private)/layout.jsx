"use client";
import { useState } from "react";
import NavBar from "../../components/shared/NavBar";

function ExtraNavItems() {
  const [isOpen, setIsOpen] = useState(false);
  const [isJoinChat, setIsJoinChat] = useState(true);
  const [joinChatId, setJoinChatId] = useState("");
  const [createChatName, setCreateChatName] = useState("");
  const [createChatId, setCreateChatId] = useState("");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleChatType = () => {
    setIsJoinChat(!isJoinChat);
  };
  const handleCreateChat = () => {
    console.log("Creating chat");
  };
  const handleJoinChat = () => {
    console.log("Joining chat");
  };
  return (
    <>
      <div className="relative inline-block text-left">
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-x-2 font-medium text-gray-500 hover:text-blue-600 sm:border-gray-300 sm:my-6 sm:ps-6 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            data-name="Layer 1"
            viewBox="0 0 122.88 119.8"
            fill="currentColor"
            className="flex-shrink-0 size-4"
            width={16}
            height={16}
          >
            <path d="M23.59 0h75.7a23.63 23.63 0 0123.59 23.59v72.62a23.64 23.64 0 01-23.59 23.59h-75.7a23.53 23.53 0 01-16.67-6.93l-.38-.42A23.49 23.49 0 010 96.21V23.59A23.63 23.63 0 0123.59 0zm31.47 38.05a6.38 6.38 0 1112.76 0v15.46h15.47a6.39 6.39 0 110 12.77H67.82v15.47a6.38 6.38 0 01-12.76 0V66.28H39.59a6.39 6.39 0 110-12.77h15.47V38.05zm44.23-25.28h-75.7a10.86 10.86 0 00-10.82 10.82v72.62a10.77 10.77 0 002.9 7.37l.28.26a10.76 10.76 0 007.64 3.16h75.7a10.87 10.87 0 0010.82-10.82V23.59a10.86 10.86 0 00-10.82-10.82z"></path>
          </svg>
          Join / Create Chat
        </button>
      </div>
      {isOpen && (
        <div className="absolute right-44 top-14 z-100 mt-2 w-56 bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg dark:bg-gray-800 dark:border-neutral-700">
          <div className="px-4 py-3">
            <button
              onClick={toggleChatType}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {isJoinChat ? "Switch to Create Chat" : "Switch to Join Chat"}
            </button>
          </div>
          <div className="px-4 py-3">
            {isJoinChat ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Enter Chat ID
                </label>
                <input
                  type="text"
                  value={joinChatId}
                  onChange={(e) => setJoinChatId(e.target.value)}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:border-neutral-600 dark:placeholder-gray-400 dark:text-white"
                />
                <button
                  onClick={handleJoinChat}
                  className="mt-4 w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                >
                  Join Chat
                </button>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Chat Name
                </label>
                <input
                  type="text"
                  value={createChatName}
                  onChange={(e) => setCreateChatName(e.target.value)}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:border-neutral-600 dark:placeholder-gray-400 dark:text-white"
                />
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mt-4">
                  Chat ID
                </label>
                <input
                  type="text"
                  value={createChatId}
                  onChange={(e) => setCreateChatId(e.target.value)}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:border-neutral-600 dark:placeholder-gray-400 dark:text-white"
                />
                <button
                  onClick={handleCreateChat}
                  className="mt-4 w-full px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md"
                >
                  Create Chat
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function Layout({ children }) {
  return (
    <>
      <main className="min-h-screen bg-[rgba(255,255,255,0.1)] dark:bg-gray-900">
        <NavBar>
          <ExtraNavItems />
        </NavBar>
        {children}
      </main>
    </>
  );
}
