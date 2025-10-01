import React, { useEffect, useState } from "react";
import "./home.css";
import { FaUserGraduate, FaChalkboardTeacher, FaUniversity, FaProjectDiagram } from "react-icons/fa";
function HomePage() {
  const [counts, setCounts] = useState({
    student: 0,
    lecturer: 0,
    principal_lecturer: 0,
    program_leader: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/users`);
        const data = await res.json();
        if (data.users) {
          setCounts({
            student: data.users.filter(u => u.role === "student").length,
            lecturer: data.users.filter(u => u.role === "lecturer").length,
            principal_lecturer: data.users.filter(u => u.role === "principal_lecturer").length,
            program_leader: data.users.filter(u => u.role === "program_leader").length,
          });
        }
      } catch (err) {
        console.error("Error fetching user counts:", err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="homepage">
      <section className="hero">
        <h1>LUCT Reporting Dashboard</h1>
        <p>Manage students, lecturers, principals, and program leaders efficiently</p>
        <a href="/login" className="btn">Get Started</a>
      </section>

      <section className="cards">
        <div className="card">
          <FaUserGraduate className="icon" />
          <h2>Student</h2>
          <p>{counts.student} students registered</p>
        </div>

        <div className="card">
          <FaChalkboardTeacher className="icon" />
          <h2>Lecturer</h2>
          <p>{counts.lecturer} lecturers registered</p>
        </div>

        <div className="card">
          <FaUniversity className="icon" />
          <h2>Principal</h2>
          <p>{counts.principal_lecturer} principals registered</p>
        </div>

        <div className="card">
          <FaProjectDiagram className="icon" />
          <h2>Program Leader</h2>
          <p>{counts.program_leader} program leaders registered</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
