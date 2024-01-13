import { Route, Routes } from "react-router-dom";
import io from "socket.io-client";
import Home from "./pages/home";
import Authentication from "./pages/auth";
import ChatRoom from "./pages/chat";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/protected";
import { useEffect } from "react";
const socket = io.connect("http://localhost:8000");

const App = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    socket.on("socket_error", (data) => {
      console.error(`Error during ${data.type}: ${data.error}`);
      alert(data.error);
    });

    return () => {
      socket.removeListener("connect");
      socket.removeListener("socket_error");
      socket.disconnect();
    };
  });
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
