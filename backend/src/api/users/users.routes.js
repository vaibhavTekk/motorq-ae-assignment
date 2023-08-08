const express = require('express');
const { isAuthenticated } = require('../../middlewares');
const { findUserById, listAllUsers } = require('./users.services');

const router = express.Router();

router.get('/', isAuthenticated, async (req,res,next) => {
  try{
    const users = await listAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
})

router.get('/profile', isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.payload;
    const user = await findUserById(userId);
    delete user.password;
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', isAuthenticated, async (req,res,next) => {
  try{
    const userId = req.params.id;
    const user = await findUserById(userId);
    delete user.password;
    if (user) {
      res.json(user);
    }
  } catch (err) {
    next(new Error("User Not Found"));
  }
})

module.exports = router;
