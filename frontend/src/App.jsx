import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";

import HomeLayout from "./components/layout/HomeLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Election from "./pages/vote/Election";
import Candidates from "./pages/vote/Candidates";
import Vote from "./pages/vote/Vote";
import Results from "./pages/vote/Results";
import Profile from "./pages/vote/Profile";
import VoteCandidates from "./pages/vote/VoteCandidate";
import VerifyOTP from "./pages/auth/VerifyOTP";
import Home from "./pages/Home";
import ElectionResult from "./pages/vote/ElectionResult";

import { useAuth } from "./context/AuthContext"; // ✅ use context

function App() {
  const { isAuthenticated, loading } = useAuth(); // ✅ get from context

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  if (loading) {
    return <p>Loading...</p>; // You can replace this with a loader/spinner
  }

  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="verify-otp" element={<VerifyOTP />} />
        <Route path="register" element={<Register />} />

        {/* 🔒 Protected Routes */}
        <Route path="election" element={<PrivateRoute><Election /></PrivateRoute>} />
        <Route path="vote" element={<PrivateRoute><Vote /></PrivateRoute>} />
        <Route path="vote/:electionId" element={<PrivateRoute><VoteCandidates /></PrivateRoute>} />
        <Route path="election/:id/candidates" element={<PrivateRoute><Candidates /></PrivateRoute>} />
        <Route path="results" element={<PrivateRoute><Results /></PrivateRoute>} />
        <Route path="election-result/:electionId" element={<PrivateRoute><ElectionResult /></PrivateRoute>} />
        <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
