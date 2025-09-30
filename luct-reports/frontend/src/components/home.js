import React from "react";
import "./home.css";
import { FaUserGraduate, FaChalkboardTeacher, FaUniversity, FaProjectDiagram } from "react-icons/fa";

function HomePage() {
  return (
    <div className="homepage">

      {/* Hero Section */}
      <section className="hero">
        <h1>LUCT Reporting Dashboard</h1>
        <p>Manage students, lecturers, principals, and program leaders efficiently</p>
        <a href="/login" className="btn">Get Started</a>
      </section>

      {/* CMS Cards Section */}
      <section className="cards">
        <div className="card">
          <FaUserGraduate className="icon" />
          <h2>Student</h2>
          <p>Monitor student performance, attendance, and ratings with ease.</p>
        </div>

        <div className="card">
          <FaChalkboardTeacher className="icon" />
          <h2>Lecturer</h2>
          <p>Manage classes, assignments, and schedules efficiently.</p>
        </div>

        <div className="card">
          <FaUniversity className="icon" />
          <h2>Principal</h2>
          <p>Get a clear overview of departments and faculty performance.</p>
        </div>

        <div className="card">
          <FaProjectDiagram className="icon" />
          <h2>Program Leader</h2>
          <p>Oversee programs, curricula, and student progress seamlessly.</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
