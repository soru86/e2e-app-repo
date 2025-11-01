import { useState } from "react";
import { Link } from "react-router";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("Transaction History");
  return (
    <nav className="flex gap-5">
      <Link
        to="/history"
        className={`text-sm font-medium px-3 py-2 rounded-md ${
          activeTab === "Transaction History"
            ? "bg-white text-blue-500"
            : "hover:bg-blue-400"
        }`}
        onClick={() => setActiveTab("Transaction History")}
      >
        Transaction History
      </Link>
    </nav>
  );
};

export default Navbar;
