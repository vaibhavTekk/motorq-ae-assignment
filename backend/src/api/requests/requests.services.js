const { db } = require("../../utils/db");

function createRequest(requestName, requestDescription, attachments, workflowType) {
  return prisma.request.create({
    data: {
      requestName,
      requestDescription,
      attachments,
      workflowType: {
        connect: { id: workflowType }, // Connect the selected approval type
      },
      status: "Draft", // Set initial status
      approvers: {
        connect: {}
      }
    },
  });
}
