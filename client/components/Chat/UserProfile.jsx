import React from "react";

const UserProfile = () => {
  return (
    <div className="flex flex-col items-center bg-indigo-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mt-1 w-full py-4 px-2 rounded-lg">
      <div className="h-20 w-20 rounded-full border overflow-hidden">
        <img
          src="https://avatars3.githubusercontent.com/u/2763884?s=128"
          alt="Avatar"
          className="h-full w-full"
        />
      </div>
      <div className="text-sm font-semibold mt-2">Aminos Co.</div>
    </div>
  );
};

export default UserProfile;
