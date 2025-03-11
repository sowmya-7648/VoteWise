import { Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <Routes>
      {/* Root route with HomeLayout as a layout for nested routes */}
      <Route path="/" element={<HomeLayout />}>
        {/* Index route renders Election page */}
        <Route index element={<Election />} />

        {/* Authentication routes */}
        <Route path="login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="register" element={<Register />} />

        {/* Election-related routes */}
        <Route path="election" element={<Election />} />
        <Route path="vote" element={<Vote />} />
        <Route path="vote/:electionId" element={<VoteCandidates />} />

        <Route path="election/:id/candidates" element={<Candidates />} />
        <Route path="results" element={<Results />} />


        {/* User Profile route */}
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
