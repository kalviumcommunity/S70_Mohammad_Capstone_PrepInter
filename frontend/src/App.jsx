import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./components/Signup";
import LoginPage from "./components/Login";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import ProfilePage from "./components/ProfilePage";
import Performance from "./components/Performance";
import MockInterviewSetup from "./components/MockInterviewSetup";
import InterviewComplete from "./components/InterviewResult";
import InterviewPage from "./components/InterviewPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signIn" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/performance" element={
            <ProtectedRoute>
              <Performance />
            </ProtectedRoute>
          } />
          <Route path="/mock-interview-setup" element={
            <ProtectedRoute>
              <MockInterviewSetup />
            </ProtectedRoute>
          } />
          <Route path="/result" element={
            <ProtectedRoute>
              <InterviewComplete />
            </ProtectedRoute>
          } />
          <Route path="/interview" element={
            <ProtectedRoute>
              <InterviewPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
