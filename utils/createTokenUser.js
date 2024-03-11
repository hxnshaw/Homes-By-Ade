const createTokenUser = (user) => {
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    userId: user.id,
    email: user.email,
    role: user.role,
  };
};

module.exports = createTokenUser;
