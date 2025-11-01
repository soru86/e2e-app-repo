import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

const UserDropdown = () => {
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 hover:text-gray-200"
      >
        <FaUserCircle className="text-xl" />
        <span className="hidden sm:inline">User</span>
      </button>
      {dropdownOpen && (
        <ul className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-md z-10">
          <li
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserDropdown;
