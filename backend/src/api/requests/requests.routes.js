const express = require("express");
const { isAuthenticated } = require("../../middlewares");
const { db } = require("../../../utils/db.js");

const router = express.Router();

app.post("/request", isAuthenticated, async (req, res) => {
  const { requestName, requestDescription, attachments, workflowType, approvers } = req.body;
  try {
    const createdRequest = await createRequest({
      requestName,
      requestDescription,
      attachments,
      workflowType,
    });
    res.json(createdRequest);
  } catch (error) {
    next(error);
  }
});

// Route to approve a request and move to the next approval step
router.post("/request/:id/approve", isAuthenticated, async (req, res) => {
  const requestId = req.params.id;
  const { userId } = req.payload;

  try {
    const request = await db.request.findUnique({
      where: { requestID: requestId },
      include: { approvedBy: true, workflowType: true },
    });

    // Check if the request is under review and the user is an approver
    if (request.status === "Under Review" && request.approvedBy.some((approver) => approver.id === userId)) {
      const updatedRequest = await prisma.request.update({
        where: { requestID: requestId },
        data: { approvedBy: { connect: { id: userId } } }, // Connect the current user as an approver
      });

      // Check if the request has been approved based on the approval type
      if (await isWorkflowApproved(requestId, request.workflowType.name)) {
        await prisma.request.update({
          where: { requestID: requestId },
          data: { status: "Approved" }, // Move to the "Approved" status
        });
      } else {
        await prisma.request.update({
          where: { requestID: requestId },
          data: { status: "Under Approval" }, // Move to the "Under Approval" status
        });
      }

      res.json(updatedRequest);
    } else {
      next(new Error("Access denied."));
    }
  } catch (error) {
    next(err);
  }
});

router.post("/request/:id/reject", isAuthenticated, async (req, res) => {
  const requestId = req.params.id;

  try {
    const request = await prisma.request.findUnique({
      where: { requestID: requestId },
      include: { workflowType: true },
    });

    if (request.status === "Under Review") {
      if (
        (request.workflowType.name === "Everyone" && isWorkflowApproved(requestId, request.workflowType.name)) ||
        (request.workflowType.name === "AtLeastOne" && !isWorkflowApproved(requestId, request.workflowType.name)) ||
        (request.workflowType.name === "AtLeastTwo" && !isWorkflowApproved(requestId, request.workflowType.name, 2))
      ) {
        const updatedRequest = await prisma.request.update({
          where: { requestID: requestId },
          data: { status: "Rejected" }, // Change status to "Rejected"
        });

        res.json(updatedRequest);
      } else {
        next(new Error("Access denied."));
      }
    } else {
      next(new Error("Access denied."));
    }
  } catch (error) {
    next(error);
  }
});

router.put("/request/:id", isAuthenticated, async (req, res) => {
  const requestId = req.params.id;
  const { requestName, requestDescription, attachments, workflowType } = req.body;

  try {
    const request = await prisma.request.findUnique({
      where: { requestID: requestId },
      include: { workflowType: true },
    });

    if (request.status === "JustificationRequired") {
      const updatedRequest = await prisma.request.update({
        where: { requestID: requestId },
        data: {
          requestName,
          requestDescription,
          attachments,
          workflowType: {
            connect: { id: workflowType },
          },
          status: "Draft", // Reset status to "Draft"
        },
      });

      res.json(updatedRequest);
    } else {
      res.status(403).json({ message: "Access denied." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
});

router.post("/request/:id/justify", isAuthenticated, async (req, res) => {
  const requestId = req.params.id;
  const { userId } = req.payload;

  try {
    const request = await prisma.request.findUnique({
      where: { requestID: requestId },
      include: { approvedBy: true, workflowType: true },
    });

    // Check if the request is under review and the user is an approver
    if (request.status === "Under Review" && request.approvedBy.some((approver) => approver.id === userId)) {
      // Check if the approval type is "Everyone" or "AtLeastTwo" and the request is not yet approved
      if (
        (request.workflowType.name === "Everyone" || request.workflowType.name === "AtLeastTwo") &&
        !isWorkflowApproved(requestId, request.workflowType.name)
      ) {
        const updatedRequest = await prisma.request.update({
          where: { requestID: requestId },
          data: { status: "Justification Required" }, // Change status to "Justification Required"
        });

        res.json(updatedRequest);
      } else {
        res.status(403).json({ message: "Access denied." });
      }
    } else {
      res.status(403).json({ message: "Access denied." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
});

// Function to check if the request is approved based on the approval type
async function isWorkflowApproved(requestId, approvalType) {
  const request = await prisma.request.findUnique({
    where: { requestID: requestId },
    include: { approvedBy: true },
  });

  if (approvalType === "Everyone") {
    return request.approvedBy.length === request.approvedBy.length;
  } else if (approvalType === "AtLeastTwo") {
    return request.approvedBy.length >= 2;
  } else if (approvalType === "Anyone") {
    return request.approvedBy.length >= 1;
  }

  return false;
}

module.exports = router;
