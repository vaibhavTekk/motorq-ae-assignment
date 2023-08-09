const { db } = require("../../utils/db");

function listWorkflows() {
  return db.workflow.findMany();
}

function getWorkflow(id) {
  const workflow = prisma.workflow.findUnique({
    where: { id },
  });
  if (!workflow) {
    throw new Error("Workflow not found.");
  }
  return workflow;
}

function createWorkflow({ title, name, desc, createdBy, approvers, approvalType }) {
  return prisma.workflow.create({
    data: {
      title,
      name,
      desc,
      createdBy: { connect: { id: createdBy } },
      approvers: { connect: approvers.map((approverId) => ({ id: approverId })) },
      approvalType,
    },
  });
}

module.exports = { listWorkflows, getWorkflow, createWorkflow };
