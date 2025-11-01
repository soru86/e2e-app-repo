const userModel = require("../models/user");

const fetchUserByName = async (name) => {
  return await userModel.findOne({
    userName: name,
  });
};

const createNewUser = async (user) => {
  const inputUser = new userModel(user);
  return await inputUser.save();
};

module.exports = {
  fetchUserByName,
  createNewUser,
};
