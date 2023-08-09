import { useState, useEffect } from "react";
import axios from "axios";

const AdminSection = () => {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [approvalType, setApprovalType] = useState("");
  const [approvers, setApprovers] = useState([]);
  const [selectedApprovers, setSelectedApprovers] = useState([]);
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    fetchApprovers();
    fetchWorkflows();
  }, []);

  const fetchApprovers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/users/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const approverUsers = response.data.filter((user) => user.roles.some((role) => role.name === "Approver"));
      setApprovers(approverUsers);
    } catch (error) {
      console.error("Error fetching approvers:", error);
    }
  };

  const fetchWorkflows = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/workflows/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setWorkflows(response.data);
    } catch (error) {
      console.error("Error fetching workflows:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://localhost:5000/api/v1/workflows",
        {
          title,
          name,
          desc,
          approvalType,
          approverIDs: selectedApprovers,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Workflow created:", response.data);
      setTitle("");
      setName("");
      setDesc("");
      setApprovalType("");
      setSelectedApprovers([]);
      fetchWorkflows(); // Refresh the list of workflows after creating a new one
    } catch (error) {
      console.error("Error creating workflow:", error);
    }
  };

  const handleApproverChange = (approverId) => {
    if (selectedApprovers.includes(approverId)) {
      setSelectedApprovers(selectedApprovers.filter((id) => id !== approverId));
    } else {
      setSelectedApprovers([...selectedApprovers, approverId]);
    }
  };

  return (
    <div>
      <h2>Admin Section</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} required />
        </div>
        <div>
          <label>Approval Type:</label>
          <select value={approvalType} onChange={(e) => setApprovalType(e.target.value)} required>
            <option value="">Select Approval Type</option>
            <option value="Everyone">Everyone</option>
            <option value="AtLeastTwo">At Least Two</option>
            <option value="Anyone">Anyone</option>
          </select>
        </div>
        <div>
          <label>Approvers:</label>
          <div>
            {approvers.map((approver) => (
              <div key={approver.id}>
                <input
                  type="checkbox"
                  id={approver.id}
                  value={approver.id}
                  checked={selectedApprovers.includes(approver.id)}
                  onChange={(e) => handleApproverChange(e.target.value)}
                />
                <label htmlFor={approver.id}>{approver.email}</label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit">Create Workflow</button>
      </form>

      <div>
        <h3>Existing Workflows</h3>
        <ul>
          {workflows.map((workflow) => (
            <li key={workflow.id}>{workflow.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminSection;
