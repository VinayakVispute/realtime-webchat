import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ socket }) => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    // Add your logic for joining a room
    if (username === "" || roomId === "") {
      alert("Please enter username and room id");
      return;
    }
    try {
      socket.emit("join_room", roomId);
      // navigate("/chat");
      navigate("/chat", { state: { username, roomId } });
    } catch (error) {
      console.log(error);
    }
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col items-center space-y-2">
          <label htmlFor="roomId" className="text-lg font-medium text-gray-700">
            Room ID/Name:
          </label>
          <input
            type="text"
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        <div className="flex">
          <button
            onClick={handleJoin}
            className="px-16 py-3 text-2xl font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
