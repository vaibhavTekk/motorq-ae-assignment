const express = require("express");
const { isAuthenticated } = require("../../middlewares");
const { isAdmin } = require("../users/users.services");

const { listWorkflows, getWorkflow, createWorkflow } = require("./workflows.services.js");

const router = express.Router();

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const workflows = await listWorkflows();
    res.json(workflows);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAuthenticated, async (req, res, next) => {
  const { title, name, desc, approverIDs, approvalType } = req.body;
  // const { createdBy } = req.payload;
  const { userId } = req.payload;
  try {
    if (isAdmin(userId)) {
      const workflow = await createWorkflow({ title, name, desc, userId, approverIDs, approvalType });
      res.json(workflow);
    } else {
      throw new Error("Not Admin - Access Denied");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:id", async (req, res) => {
  const workflowId = req.params.id;
  try {
    const workflow = await getWorkflow(workflowId);
    res.json(workflow);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
