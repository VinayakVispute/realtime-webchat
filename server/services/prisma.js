const { PrismaClient } = require("@prisma/client");

const prismaClient = new PrismaClient({
  log: ["query"],
});

async function findOrCreateUser(name, id) {
  // Try to find the user by name
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

async function addUserToRoom(roomId, userName, socketId) {
  const userRoomAdd = await prismaClient.OnlineUser.create({
    data: {
      User: {
        connect: {
          name: userName,
        },
      },
      room: {
        connect: {
          roomId: roomId,
        },
      },
      socketId: socketId,
    },
  });

  const usersInRoom = await prismaClient.OnlineUser.findMany({
    where: {
      roomId,
    },
  });

  return usersInRoom;
}

async function getAllUsersInRoom(roomId) {
  const usersInRoom = await prismaClient.OnlineUser.findMany({
    where: {
      roomId,
    },
  });

  return usersInRoom;
}
async function getMessageFromDatabase(roomName, userNames) {
  console.log("receiver", roomName, "author", userNames);
  const messages = await prismaClient.message.findMany({
    where: {
      receiver: roomName,
      author: userNames,
    },
    orderBy: {
      timestamp: "asc", // or 'desc' for descending order
    },
  });
  return messages;
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
  const usersInRoom = await getAllUsersInRoom(roomId);

  return usersInRoom;
}

function getAllMessagesInRoom(roomId) {
  console.log("roomId", roomId);
  return prismaClient.message.findMany({
    where: {
      receiver: roomId,
    },
    orderBy: {
      timestamp: "asc", // or 'desc' for descending order
    },
  });
}

async function isUserAlreadyInRoom(roomId, userId, socketId) {
  const userRoom = await prismaClient.OnlineUser.findMany({
    where: {
      User: {
        id: userId,
      },
      roomId,
    },
  });

  if (userRoom.length > 0) {
    await prismaClient.OnlineUser.updateMany({
      where: {
        User: {
          id: userId,
        },
        roomId,
      },
      data: {
        socketId,
      },
    });
    return true;
  }
  return false;
}

module.exports = {
  prismaClient,
  findOrCreateUser,
  addUserToRoom,
  usersRemoveFromRoom,
  getAllMessagesInRoom,
  isUserAlreadyInRoom,
  getAllUsersInRoom,
  getMessageFromDatabase,
};
