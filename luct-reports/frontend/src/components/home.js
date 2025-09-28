import React from "react";
import "./home.css";

function HomePage() {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <h1>WELCOME TO LUCT-REPORTING APP</h1>
        <p>Your gateway to students, lecturers, and program management</p>
        <a href="/login" className="btn">Get Started</a>
      </section>

      {/* Cards Section */}
      <section className="cards">
        <div className="card">
          <h2>Student</h2>
          <p>mornitoring and rating.</p>
          
        </div>

        <div className="card">
          <h2>Lecturer</h2>
          <p>Manage your classes, assignments, and schedules.</p>
          
        </div>

        <div className="card">
          <h2>Principal</h2>
          <p>Overview of departments and faculty performance.</p>
          
        </div>

        <div className="card">
          <h2>Program Leader</h2>
          <p>Manage programs, curricula, and student progress.</p>
          
        </div>
      </section>
    </div>
  );
}

export default HomePage;
