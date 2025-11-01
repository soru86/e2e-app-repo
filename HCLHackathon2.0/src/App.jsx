import { Route, Routes } from "react-router";
import Login from "./components/Login";
import ProtectedComponent from "./components/ProtectedComponent";
import { Outlet } from "react-router";
import Navbar from "./components/Navbar";
import TransactionHistory from "./components/TransactionHistory";
import UserDropdown from "./components/UserDropdown";
import PortfolioSummary from "./components/PortfolioSummary";

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
        <Route path="/login" element={<Login />} />
        <Route
          path="/history"
          element={
            <ProtectedComponent>
              <TransactionHistory />
            </ProtectedComponent>
          }
        />
      </Routes>
      {/* Footer */}
      <footer className="bg-gray-100 text-center p-4 text-sm">
        © 2025 HCLTech Hackathon 2.0. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
