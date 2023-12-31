const { PrismaClient } = require("@prisma/client");

const prismaClient = new PrismaClient({
  log: ["query"],
});

async function findOrCreateUser(name, id) {
  // Try to find the user by name
  console.log("name", name, "id", id);
  const existingUser = await prismaClient.user.findUnique({
    where: {
      name,
      id: id,
    },
  });

  // If the user exists, return the existing user
  if (existingUser) {
    return existingUser;
  }

  // If the user does not exist, create a new user
  const newUser = await prismaClient.user.create({
    data: {
      id,
      name,
    },
  });

  return newUser;
}

async function addUserToRoom(roomId, userName) {
  const userRoomAdd = await prismaClient.OnlineUser.create({
    data: {
      User: {
        connect: {
          name: userName,
        },
      },
      roomId: roomId,
    },
  });

  console.log("userRoomAdd", userRoomAdd);

  const usersInRoom = await prismaClient.OnlineUser.findMany({
    where: {
      roomId,
    },
  });

  console.log("usersInRoom", usersInRoom);
  return usersInRoom;
}

async function usersRemoveFromRoom(roomId, userId) {
  const userRoomRemove = await prismaClient.OnlineUser.deleteMany({
    where: {
      User: {
        id: userId,
      },
      roomId: roomId,
    },
  });
  console.log("userRoomRemove", userRoomRemove);
  const usersInRoom = await prismaClient.OnlineUser.findMany({
    where: {
      roomId,
    },
  });

  console.log("usersInRoom", usersInRoom);
  return usersInRoom;
}

module.exports = {
  prismaClient,
  findOrCreateUser,
  addUserToRoom,
  usersRemoveFromRoom,
};
