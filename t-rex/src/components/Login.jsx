import { useActionState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../common/redux/reducers/user-slice";
import { redirect } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();
  const dispatch = useDispatch();
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      let error = "";
      const userName = formData.get("userName");
      const password = formData.get("password");

      if (userName && password) {
        const response = await dispatch(loginUser({ userName, password }));

        if (!response?.payload || response.error) {
          redirect("/login");
          return error;
        } else {
          await login(userName);
        }
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
          Sign in
        </h2>
        <form className="space-y-4" action={submitAction}>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <input
              name="userName"
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              name="password"
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
              disabled={isPending}
            >
              Login
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
          Don't have an account?{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
