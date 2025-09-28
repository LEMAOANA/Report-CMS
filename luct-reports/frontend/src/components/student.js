import React from "react";
import "./student.css";

function Student() {
  return (
    <div className="student-container">
      <h1>Student Dashboard</h1>
      <p>Welcome, Student! Here you can view your attendance, reports, and feedback.</p>

      <div className="student-cards">
        <div className="card">
          <h2>My Classes</h2>
          <p>View the list of courses you are enrolled in.</p>
          <button>View Classes</button>
        </div>
        <div className="card">
          <h2>Reports</h2>
          <p>Access lecturer reports and feedback about your performance.</p>
          <button>View Reports</button>
        </div>

        <div className="card">
          <h2>Rate Lecturer</h2>
          <p>Provide feedback or rate your lecturers.</p>
          <button>Rate Now</button>
        </div>
      </div>
    </div>
  );
}

export default Student;
