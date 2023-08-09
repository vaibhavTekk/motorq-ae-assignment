import { useState, useEffect } from "react";
import axios from "axios";
// import { useUser } from "../utils/UserContext"; // Assuming you have your UserContext imported

const RequesterSection = () => {
  const [requestName, setRequestName] = useState("");
  const [requestDescription, setRequestDescription] = useState("");
  const [attachments, setAttachments] = useState("");
  const [workflowType, setWorkflowType] = useState("");
  const [approvers, setApprovers] = useState("");
  const [workflowTypes, setWorkflowTypes] = useState([]);
  //   const { user } = useUser(); // Get user from context

  useEffect(() => {
    fetchWorkflowTypes();
  }, []);

  const fetchWorkflowTypes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/workflows", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      console.log(response.data);
      setWorkflowTypes(response.data);
    } catch (error) {
      console.error("Error fetching workflow types:", error);
    }
  };

  const handleWorkflowTypeChange = async (e) => {
    const selectedWorkflowTypeId = e.target.value;

    try {
      const response = await axios.get(`http://localhost:5000/api/v1/workflows/${selectedWorkflowTypeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });

      const selectedWorkflowType = response.data[0]; // Select the first workflow type object from the array

      if (selectedWorkflowType) {
        // Map the array of approvers to get their emails and join them
        const approversList = selectedWorkflowType.approvers.map((approver) => approver.email).join(", ");
        setApprovers(approversList);
      } else {
        setApprovers("");
      }
    } catch (error) {
      console.error("Error fetching approvers for workflow:", error);
    }

    setWorkflowType(selectedWorkflowTypeId);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const accessToken = localStorage.getItem("accessToken"); // Get bearer token from local storage
      const response = await axios.post(
        "http://localhost:5000/api/v1/requests/",
        {
          requestName,
          requestDescription,
          attachments: attachments.split(",").map((attachment) => attachment.trim()),
          workflowType,
          approvers: approvers.split(",").map((approver) => approver.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Request created:", response.data);
      // Clear form fields after successful submission
      setRequestName("");
      setRequestDescription("");
      setAttachments("");
      setWorkflowType("");
      setApprovers("");
    } catch (error) {
      console.error("Error creating request:", error);
    }
  };

  return (
    <div>
      <h2>Requester Section</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Request Name:</label>
          <input type="text" value={requestName} onChange={(e) => setRequestName(e.target.value)} required />
        </div>
        <div>
          <label>Request Description:</label>
          <textarea value={requestDescription} onChange={(e) => setRequestDescription(e.target.value)} required />
        </div>
        <div>
          <label>Attachments (comma-separated):</label>
          <input type="text" value={attachments} onChange={(e) => setAttachments(e.target.value)} />
        </div>
        <div>
          <label>Workflow Type:</label>
          <select value={workflowType} onChange={handleWorkflowTypeChange} required>
            <option value="">Select Workflow Type</option>
            {workflowTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default RequesterSection;
