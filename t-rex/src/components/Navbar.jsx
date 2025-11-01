import { useState } from "react";
import { Link } from "react-router";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("Home");
  return (
    <nav className="flex gap-5">
      <Link
        to="/home"
        className={`text-sm font-medium px-3 py-2 rounded-md ${
          activeTab === "Home" ? "bg-white text-blue-500" : "hover:bg-blue-400"
        }`}
        onClick={() => setActiveTab("Home")}
      >
        Home
      </Link>
      <Link
        to="/profile"
        className={`text-sm font-medium px-3 py-2 rounded-md ${
          activeTab === "Profile"
            ? "bg-white text-blue-500"
            : "hover:bg-blue-400"
        }`}
        onClick={() => setActiveTab("Profile")}
      >
        Profile
      </Link>
      <Link
        to="/settings"
        className={`text-sm font-medium px-3 py-2 rounded-md ${
          activeTab === "Settings"
            ? "bg-white text-blue-500"
            : "hover:bg-blue-400"
        }`}
        onClick={() => setActiveTab("Settings")}
      >
        Settings
      </Link>
    </nav>
  );
};

export default Navbar;
