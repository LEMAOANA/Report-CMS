import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/footer";
import Home from "./components/home";
import Login from "./components/login";
import Signup from "./components/signup"; // Signup component
import Student from "./components/student";
import Lecturer from "./components/lecturer";
import Principal from "./components/principal";
import Leader from "./components/leader";
import ProtectedRoute from "./components/ProtectedRoute"; // ProtectedRoute

function App() {
  return (
    <Router>
      {/* Main content */}
      <div className="main-content" style={{ minHeight: "80vh" }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />

          {/* Protected routes */}
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
                <Home /> {/* or Admin component if you have one */}
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;
