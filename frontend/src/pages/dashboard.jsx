// import { useContext } from "react";
import { useUser } from "../utils/UserContext";
import ApproverSection from "./ApproverSection";
import RequesterSection from "./RequesterSection";
import AdminSection from "./AdminSection";

const Dashboard = () => {
  const { user } = useUser(); // Access the user from context
  console.log(user);
  return (
    <div>

      {/* Conditionally render sections based on user's roles */}
      {user && user.roles.some((role) => role.name === "Admin") && (
        <div>
          <AdminSection></AdminSection>
          {/* Content for Admin section */}
        </div>
      )}

      {user && user.roles.some((role) => role.name === "Requester") && (
        <div>
          <RequesterSection></RequesterSection>
          {/* Content for Requester section */}
        </div>
      )}

      {user && user.roles.some((role) => role.name === "Approver") && (
        <div>
          <ApproverSection></ApproverSection>
          {/* Content for Approver section */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
