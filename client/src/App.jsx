import { Route, Routes } from "react-router-dom";
import io from "socket.io-client";
import Home from "./pages/home";
import Authentication from "./pages/auth";
import ChatRoom from "./pages/chat";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/protected";
const socket = io.connect("http://192.168.0.69:8000");

const App = () => {
  return (
    <div className="bg-white  min-w-screen ">
      <Routes>
        <Route
          index
          Path="/"
          element={
            <ProtectedRoute>
              <NavBar />
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
