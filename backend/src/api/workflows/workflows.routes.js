const express = require("express");
const { isAuthenticated } = require("../../middlewares");
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
  const { createdBy } = req.payload;
  try {
    if (isAdmin(currUserID)) {
      const workflow = await createWorkflow({ ...req.body, createdBy });
      res.json(user);
    } else {
      throw new Error("Not Admin - Access Denied");
    }
  } catch (error) {
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
