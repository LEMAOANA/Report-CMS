import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./components/home"; // landing page
import Login from "./components/login";
import Signup from "./components/signup";
import Student from "./components/student";
import Lecturer from "./components/lecturer";
import Principal from "./components/principal";
import Leader from "./components/leader";
import Admin from "./components/admin"; // Admin dashboard
import ProtectedRoute from "./components/ProtectedRoute";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation();

  // Always show Navbar on home page, login, signup, and all other pages
  const showNavbar = true;

  return (
    <>
      {showNavbar && <Navbar />}

      <div className="main-content" style={{ minHeight: "80vh" }}>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected pages */}
          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <Student />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer"
            element={
              <ProtectedRoute role="lecture">
                <Lecturer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/principal"
            element={
              <ProtectedRoute role="principal_lecture">
                <Principal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leader"
            element={
              <ProtectedRoute role="program_leader">
                <Leader />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Admin /> {/* Admin dashboard */}
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default AppWrapper;
