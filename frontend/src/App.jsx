import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import ChallengeForm from "./components/Challenge"; // ✅ Import Challenge Form

const App = () => {
    const isAuthenticated = !!localStorage.getItem("token"); // Check if user is logged in

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/challenge" element={isAuthenticated ? <ChallengeForm /> : <Navigate to="/login" />} /> 
            </Routes>
        </Router>
    );
};

export default App;
