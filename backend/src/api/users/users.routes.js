const express = require("express");
const { isAuthenticated } = require("../../middlewares");
const { findUserById, listAllUsers, addRoleToUser, isAdmin, removeRole, addRole } = require("./users.services");

const router = express.Router();

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const users = await listAllUsers();
    users.map((user) => {
      delete user.password;
      return user;
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/profile", isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.payload;
    const user = await findUserById(userId);
    delete user.password;
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.put("/addRole/:id", isAuthenticated, async (req, res, next) => {
  const userId = req.params.id;
  const { currUserID } = req.payload;
  const { roleName } = req.body;
  try {
    if (isAdmin(currUserID)) {
      const user = await addRole(userId, roleName);
      delete user.password;
      res.json(user);
    } else {
      throw new Error("Not Admin - Access Denied");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put("/removeRole/:id", isAuthenticated, async (req, res, next) => {
  const userId = req.params.id;
  const { currUserID } = req.payload;
  const { roleName } = req.body;
  try {
    if (isAdmin(currUserID)) {
      const user = await removeRole(userId, roleName);
      delete user.password;
      res.json(user);
    } else {
      throw new Error("Not Admin - Access Denied");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await findUserById(userId);
    delete user.password;
    if (user) {
      res.json(user);
    }
  } catch (err) {
    next(new Error("User Not Found"));
  }
});

module.exports = router;
