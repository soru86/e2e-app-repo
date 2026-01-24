import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Callback from './components/Callback';
import { isAuthenticated } from './services/googleAuth';

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route path="/callback" element={<Callback />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
