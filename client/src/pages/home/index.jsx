import { useEffect, useState } from "react";
import Login from "./components/Join";
import Create from "./components/Create";
import { useAuth0 } from "@auth0/auth0-react";

const Home = ({ socket }) => {
  const user = useAuth0();
  const userName = user?.nickname || user?.username || "Guest User";
  useEffect(() => {
    socket.emit("join_server", { userName });

    return () => {
      socket.removeListener("join_server");
    };
  }, [user, userName]);

  const [showRegisterPage, setShowRegisterPage] = useState(false);

  const changeMode = () => {
    setShowRegisterPage(!showRegisterPage);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-6">
          RealTime Collaboration
        </h1>

        <div className="flex items-center justify-center my-4">
          <span
            onClick={() => setShowRegisterPage(false)}
            className={`cursor-pointer mx-4 text-2xl ${
              !showRegisterPage ? "text-green-600" : "text-gray-900"
            }`}
          >
            Login
          </span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              onChange={changeMode}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600" />
          </label>

          <span
            onClick={() => setShowRegisterPage(true)}
            className={`cursor-pointer mx-4 text-2xl ${
              showRegisterPage ? "text-green-600" : "text-gray-900"
            }`}
          >
            Register
          </span>
        </div>

        {showRegisterPage ? (
          <Create socket={socket} />
        ) : (
          <Login socket={socket} />
        )}
      </div>
    </div>
  );
};

export default Home;
