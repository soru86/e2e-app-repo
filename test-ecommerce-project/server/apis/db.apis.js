import User from "../models/User.js";

const authenticate = async ({ userName, password }) => {
  const dbUser = await User.find({
    name: userName,
  });
  console.log(dbUser);
  // TODO: use password check
};

const clearSession = () => {};

const createUser = () => {};

export { authenticate, clearSession, createUser };
