import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../utils/UserContext"; // Import the useUser hook

const ApproverSection = () => {
  const { user } = useUser(); // Access the user from context
  const [approverRequests, setApproverRequests] = useState([]);

  useEffect(() => {
    if (user && user.roles.includes("Approver")) {
      // Fetch all requests
      axios
        .get("http://localhost:5000/api/v1/requests")
        .then((response) => {
          // Filter requests for the current approver
          const filteredRequests = response.data.filter((request) =>
            request.approvedBy.some((approver) => approver.id === user.id)
          );
          setApproverRequests(filteredRequests);
        })
        .catch((error) => {
          console.error("Error fetching requests:", error);
        });
    }
  }, [user]);
  const handleApprove = (requestId) => {
    // Perform the approve action for the request
    axios
      .post(`http://localhost:5000/api/v1/request/${requestId}/approve`)
      .then((response) => {
        // Update the list of requests after approval
        setApproverRequests(
          approverRequests.map((request) => (request.requestID === requestId ? response.data : request))
        );
      })
      .catch((error) => {
        console.error("Error approving request:", error);
      });
  };

  const handleReject = (requestId) => {
    // Perform the reject action for the request
    axios
      .post(`http://localhost:5000/api/v1/request/${requestId}/reject`)
      .then((response) => {
        // Update the list of requests after rejection
        setApproverRequests(
          approverRequests.map((request) => (request.requestID === requestId ? response.data : request))
        );
      })
      .catch((error) => {
        console.error("Error rejecting request:", error);
      });
  };

  const handleReview = (requestId) => {
    // Perform the review action for the request
    axios
      .post(`/api/request/${requestId}/review`)
      .then((response) => {
        // Update the list of requests after review
        setApproverRequests(
          approverRequests.map((request) => (request.requestID === requestId ? response.data : request))
        );
      })
      .catch((error) => {
        console.error("Error sending for review:", error);
      });
  };

  return (
    <section>
      <h3>Approver Section</h3>
      <ul>
        {approverRequests.map((request) => (
          <li key={request.requestID}>
            {/* Display request details */}
            Request Name: {request.requestName}
            <div>
              {/* Buttons for different actions */}
              <button onClick={() => handleApprove(request.requestID)}>Approve</button>
              <button onClick={() => handleReject(request.requestID)}>Reject</button>
              <button onClick={() => handleReview(request.requestID)}>Send for Review</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ApproverSection;
