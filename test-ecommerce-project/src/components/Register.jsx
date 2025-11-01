import React from "react";
import { useNavigate } from "react-router-dom";

const handleFieldChange = (e, setFormData) => {
  setFormData((formData) => ({
    ...formData,
    [e.target.name]: e.target.value,
  }));
};

const Register = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/login");
  };

  const handleRegister = () => {};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-center text-2xl font-bold text-gray-700">
          Register
        </h2>
        <form
          className="mt-4"
          action="#"
          method="POST"
          onSubmit={handleRegister}
        >
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Avatar Section */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-600">Avatar</h3>
            <input
              type="text"
              placeholder="Public ID"
              className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="url"
              placeholder="Image URL"
              className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={handleRegister}
            >
              Register
            </button>
            <button
              type="submit"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <a href="#" className="text-blue-500 hover:underline">
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
