const findSocketIdByUsername = (users, username) => {
  const user = users.find((user) => user.userName === username);
  return user ? user.socketId : null;
};

module.exports = findSocketIdByUsername;
