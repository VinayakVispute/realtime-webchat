import { Route, Routes } from "react-router-dom";
import io from "socket.io-client";
import Home from "./pages/home";
import Authentication from "./pages/auth";
import ChatRoom from "./pages/chat";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/protected";
import { useEffect } from "react";

const socket = io.connect(import.meta.env.VITE_BACKEND_URL);

const App = () => {
  useEffect(() => {
    // Event listener for successful connection
    const handleConnect = () => {
      console.log("Connected to server");
    };

    // Event listener for socket errors
    const handleSocketError = (data) => {
      console.error(`Error during ${data.type}: ${data.error}`);
      alert(data.error);
    };

    // Add event listeners
    socket.on("connect", handleConnect);
    socket.on("socket_error", handleSocketError);

    // Clean up by removing event listeners when the component unmounts
    return () => {
      socket.off("connect", handleConnect);
      socket.off("socket_error", handleSocketError);
    };
  }, [socket]); // Include 'socket' in the dependency array if it is used inside the effect

  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      <Routes>
        <Route
          index
          Path="/"
          element={
            <ProtectedRoute>
              <NavBar socket={socket} />
              <Home socket={socket} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/auth"
          element={
            <>
              <NavBar />
              <Authentication socket={socket} />
            </>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatRoom socket={socket} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
