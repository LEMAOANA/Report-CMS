import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./components/home";
import Login from "./components/login";
import Student from "./components/student";
import Lecturer from "./components/lecturer";
import Principal from "./components/principal";
import Leader from "./components/leader";

function App() {
  return (
    <Router>
      <Navbar />

      {/* Main content */}
      <div className="main-content" style={{ minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student" element={<Student/>} />
          <Route path="/lecturer" element={<Lecturer />} />
          <Route path="/principal" element={<Principal/>} />
          <Route path="/leader" element={<Leader/>} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </Router>
  );
}

export default App;
