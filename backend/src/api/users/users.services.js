const bcrypt = require("bcrypt");
const { db } = require("../../utils/db");

function findUserByEmail(email) {
  return db.user.findUnique({
    where: {
      email,
    },
  });
}

function createUserByEmailAndPassword(user) {
  user.password = bcrypt.hashSync(user.password, 12);
  return db.user.create({
    data: user,
  });
}

function findUserById(id) {
  return db.user.findUnique({
    where: {
      id,
    },
    include: {
      roles: true,
    },
  });
}

function listAllUsers() {
  return db.user.findMany({
    include: {
      roles: true,
    },
  });
}

function isAdmin(userid) {
  const userWithRoles = db.user.findUnique({
    where: { id: userid },
    include: { roles: { where: { name: "Admin" } } },
  });

  if (userWithRoles.roles.length > 0) {
    return true; // User is an admin, proceed to the next middleware/route handler
  } else {
    return false;
  }
}

function removeRole(userId, roleName) {
  return db.user.update({
    include: {
      roles: true,
    },
    where: { id: userId },
    data: { roles: { disconnect: { name: roleName } } },
  });
}

function addRole(userId, roleName) {
  return db.user.update({
    include: {
      roles: true,
    },
    where: { id: userId },
    data: { roles: { connect: { name: roleName } } },
  });
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUserByEmailAndPassword,
  listAllUsers,
  isAdmin,
  removeRole,
  addRole,
};
