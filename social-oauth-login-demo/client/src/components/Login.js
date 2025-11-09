import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      // Show error message based on error type
      const errorMessages = {
        google_failed: 'Google authentication failed. Please try again.',
        facebook_failed: 'Facebook authentication failed. Please try again.',
        github_failed: 'GitHub authentication failed. Please try again.',
        linkedin_failed: 'LinkedIn authentication failed. Please try again.',
        token_generation_failed: 'Token generation failed. Please try again.',
      };

      alert(errorMessages[error] || 'Authentication failed. Please try again.');
    }
  }, [error]);

  const handleOAuthLogin = (provider) => {
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Welcome
          </h2>
          <p className="text-gray-600 mb-8">
            Sign in with your preferred social account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p className="text-sm">
              {error === 'google_failed' && 'Google authentication failed. Please try again.'}
              {error === 'facebook_failed' && 'Facebook authentication failed. Please try again.'}
              {error === 'github_failed' && 'GitHub authentication failed. Please try again.'}
              {error === 'linkedin_failed' && 'LinkedIn authentication failed. Please try again.'}
              {error === 'token_generation_failed' && 'Token generation failed. Please try again.'}
              {!['google_failed', 'facebook_failed', 'github_failed', 'linkedin_failed', 'token_generation_failed'].includes(error) && 'Authentication failed. Please try again.'}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            <FcGoogle className="w-6 h-6 mr-3" />
            <span className="text-base font-medium">Continue with Google</span>
          </button>

          <button
            onClick={() => handleOAuthLogin('facebook')}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            <FaFacebook className="w-6 h-6 mr-3" />
            <span className="text-base font-medium">Continue with Facebook</span>
          </button>

          <button
            onClick={() => handleOAuthLogin('github')}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-800 text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
          >
            <FaGithub className="w-6 h-6 mr-3" />
            <span className="text-base font-medium">Continue with GitHub</span>
          </button>

          <button
            onClick={() => handleOAuthLogin('linkedin')}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-blue-700 text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            <FaLinkedin className="w-6 h-6 mr-3" />
            <span className="text-base font-medium">Continue with LinkedIn</span>
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

