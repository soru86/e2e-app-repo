import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook, FaGithub, FaLinkedin, FaSignOutAlt, FaUser, FaEnvelope, FaCalendar } from 'react-icons/fa';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getProviderIcon = (provider) => {
    switch (provider) {
      case 'google':
        return <FaGoogle className="w-5 h-5 text-red-500" />;
      case 'facebook':
        return <FaFacebook className="w-5 h-5 text-blue-600" />;
      case 'github':
        return <FaGithub className="w-5 h-5 text-gray-800" />;
      case 'linkedin':
        return <FaLinkedin className="w-5 h-5 text-blue-700" />;
      default:
        return null;
    }
  };

  const getProviderName = (provider) => {
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out"
              >
                <FaSignOutAlt className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Profile Section */}
          <div className="px-8 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-32 h-32 rounded-full border-4 border-blue-100 object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaUser className="w-16 h-16 text-blue-600" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                  <div className="flex items-center space-x-2 text-gray-600">
                    {getProviderIcon(user.provider)}
                    <span className="text-sm font-medium">
                      Signed in with {getProviderName(user.provider)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <FaEnvelope className="w-5 h-5 text-gray-400" />
                    <span>{user.email}</span>
                  </div>

                  {user.username && (
                    <div className="flex items-center space-x-3 text-gray-700">
                      <FaUser className="w-5 h-5 text-gray-400" />
                      <span>@{user.username}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-3 text-gray-700">
                    <FaCalendar className="w-5 h-5 text-gray-400" />
                    <span>
                      Last login: {new Date(user.lastLogin).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-700">
                    <FaCalendar className="w-5 h-5 text-gray-400" />
                    <span>
                      Member since: {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">User ID</p>
                  <p className="text-sm font-mono text-gray-900">{user.id}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Authentication Provider</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{user.provider}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm">
            <span className="font-semibold">Success!</span> You have successfully authenticated using OAuth2.
            Your session is managed with JWT tokens and stored in Redis cache.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

