const { db } = require("../../utils/db");
function listWorkflows() {
  return db.workflow.findMany();
}

function getWorkflow(id) {
  const workflow = db.workflow.findUnique({
    where: { id },
  });
  if (!workflow) {
    throw new Error("Workflow not found.");
  }
  return workflow;
}

function createWorkflow({ title, name, desc, userId, approverIDs, approvalType }) {
  // console.log(createdBy.userId);
  console.log(userId);
  return db.workflow.create({
    data: {
      title,
      name,
      desc,
      creator: { connect: { id: userId } },
      approvers: { connect: approverIDs.map((approverId) => ({ id: approverId })) },
      approvalType,
    },
  });
}

module.exports = { listWorkflows, getWorkflow, createWorkflow };
