import { Route, Routes } from "react-router";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedComponent from "./components/ProtectedComponent";
import { Outlet } from "react-router";
import UserDropdown from "./components/UserDRopdown";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* Header */}
      <ProtectedComponent>
        <header className="bg-blue-500 text-white p-4 flex items-center justify-between shadow">
          <Navbar />
          <UserDropdown />
        </header>
      </ProtectedComponent>
      {/* Main Content */}
      <Outlet />
      <Routes>
        <Route
          path="/home"
          element={
            <ProtectedComponent>
              <Home />
            </ProtectedComponent>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedComponent>
              <Profile />
            </ProtectedComponent>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedComponent>
              <Settings />
            </ProtectedComponent>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/new" element={<Register />} />
      </Routes>
      {/* Footer */}
      <footer className="bg-gray-100 text-center p-4 text-sm">
        © 2025 HCLTech Hackathon. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
