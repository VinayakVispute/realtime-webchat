import { useState } from "react";

const CreatePage = ({ userName }) => {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleCreate = () => {
    // Add your logic for creating a room
  };

  return (
    <div>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <label
            htmlFor="username"
            className="text-lg font-medium text-gray-700"
          >
            User Name:
          </label>
          <input
            type="text"
            id="username"
            disabled
            value={userName || "Guest User"}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col items-center space-y-2">
          <label
            htmlFor="roomName"
            className="text-lg font-medium text-gray-700"
          >
            Room Name:
          </label>
          <input
            type="text"
            id="roomName"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col items-center space-y-2">
          <label htmlFor="roomId" className="text-lg font-medium text-gray-700">
            Room ID:
          </label>
          <input
            type="text"
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        <div className="flex items-center justify-center mt-8">
          <button
            onClick={handleCreate}
            className="px-16 py-3 text-2xl font-bold text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
