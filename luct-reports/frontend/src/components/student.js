import React, { useEffect, useState } from "react";
import "./student.css";
import Navbar from "./navbar";

function Student() {
  const [reports, setReports] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [classes, setClasses] = useState([]);
  const [viewTab, setViewTab] = useState(null); // "reports" or "classes"
  const [userId, setUserId] = useState(21); // Replace with actual logged-in student ID

  // -------------------- Fetch Data --------------------
  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/reports");
      const data = await res.json();
      setReports(data.reports || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/reportFeedback");
      const data = await res.json();
      setFeedbacks(data.feedbacks || []);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/classes");
      const data = await res.json();
      setClasses(data.classes || []);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchFeedbacks();
    fetchClasses();
  }, []);

  // -------------------- Rating Functions --------------------
  const getRatingForReport = (reportId) => {
    const fb = feedbacks.find((f) => f.reportId === reportId && f.userId === userId);
    return fb ? fb.rating : 0;
  };

  const sendRating = async (reportId, rating) => {
    const existingFeedback = feedbacks.find((f) => f.reportId === reportId && f.userId === userId);
    if (existingFeedback) {
      try {
        const res = await fetch(`http://localhost:3000/api/reportFeedback/${existingFeedback.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating }),
        });
        const data = await res.json();
        if (data.status === "success") fetchFeedbacks();
      } catch (err) {
        console.error("Error updating feedback:", err);
      }
    } else {
      try {
        const res = await fetch("http://localhost:3000/api/reportFeedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reportId, rating, userId }),
        });
        const data = await res.json();
        if (data.status === "success") fetchFeedbacks();
      } catch (err) {
        console.error("Error adding feedback:", err);
      }
    }
  };

  return (
    <div className="student-container">
      <Navbar/>
      <h1>Student Dashboard</h1>
      <p>View all reports or your classes below.</p>

      <div className="student-buttons">
        <button onClick={() => setViewTab("reports")}>View Reports</button>
        <button onClick={() => setViewTab("classes")}>View Classes</button>
      </div>

      {/* -------------------- Conditional Rendering -------------------- */}
      {viewTab === "reports" && (
        <div className="reports-section">
          <h3>All Reports</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Course</th>
                <th>Class</th>
                <th>Date</th>
                <th>Topic</th>
                <th>Learning Outcomes</th>
                <th>Lecturer Recommendations</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.Course?.name || "N/A"}</td>
                  <td>{r.Class?.name || "N/A"}</td>
                  <td>{r.dateOfLecture}</td>
                  <td>{r.topicTaught}</td>
                  <td>{r.learningOutcomes}</td>
                  <td>{r.lecturerRecommendations}</td>
                  <td>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={getRatingForReport(r.id) >= star ? "star filled" : "star"}
                          onClick={() => sendRating(r.id, star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewTab === "classes" && (
        <div className="classes-section">
          <h3>My Classes</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Year</th>
                <th>Semester</th>
                <th>Venue</th>
                <th>Scheduled Time</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.year}</td>
                  <td>{c.semester}</td>
                  <td>{c.venue}</td>
                  <td>{c.scheduledTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Student;
