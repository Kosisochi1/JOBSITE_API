const createToken = (user) => {
  return { Email: user.Email, _id: user._id, UserType: user.UserType };
};

module.exports = createToken;
