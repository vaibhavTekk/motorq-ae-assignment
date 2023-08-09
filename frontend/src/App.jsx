import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginForm from "./pages/loginForm";
import Dashboard from "./pages/dashboard";
import UserProvider from "./utils/UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
