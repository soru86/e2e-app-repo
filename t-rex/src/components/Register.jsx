import { useActionState } from "react";
import { redirect } from "react-router";
import { registerNewUser } from "../common/redux/reducers/user-slice";
import { useDispatch } from "react-redux";

const Register = () => {
  const dispatch = useDispatch();
  const [error, submitAction, isPending] = useActionState(
    (previousState, formData) => {
      let error = "";
      const password = formData.get("password");
      const confirmPassword = formData.get("confirmPassword");

      if (password === confirmPassword) {
        const inputUser = {
          fullName: formData.get("fullName"),
          userName: formData.get("userName"),
          email: formData.get("email"),
          password: formData.get("password"),
        };
        error = dispatch(registerNewUser(inputUser));
        if (error) {
          return error;
        }
        redirect("/login");
      } else {
        error = "Those passwords didn’t match. Try again.";
        return error;
      }

      return null;
    },
    null
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Create Account
        </h2>
        <form className="space-y-4" action={submitAction}>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <input
              type="text"
              name="userName"
              placeholder="Choose a username"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
              disabled={isPending}
            >
              Register
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Cancel
            </button>
          </div>
          {error && <p>{error}</p>}
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
