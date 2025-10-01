import React, { useEffect, useState } from "react";
import "./student.css";

function Student() {
  const [reports, setReports] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [classes, setClasses] = useState([]);
  const [viewTab, setViewTab] = useState(null); // "reports" or "classes"
  const userId = JSON.parse(localStorage.getItem("user"))?.id || 21;

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
      const res = await fetch("http://localhost:3000/api/reportFeedbacks");
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

  // -------------------- Feedback Helpers --------------------
  const getFeedbackForReport = (reportId) =>
    feedbacks.find((f) => f.reportId === reportId && f.userId === userId);

  // Update local feedbacks state immediately
  const updateLocalFeedback = (reportId, updated) => {
    setFeedbacks((prev) => {
      const idx = prev.findIndex((f) => f.reportId === reportId && f.userId === userId);
      if (idx > -1) {
        const newArr = [...prev];
        newArr[idx] = { ...newArr[idx], ...updated };
        return newArr;
      } else {
        return [...prev, { ...updated, reportId, userId, id: updated.id }];
      }
    });
  };

  // -------------------- Actions --------------------
  const sendRating = async (reportId, rating) => {
    const existingFeedback = getFeedbackForReport(reportId);

    // Update UI immediately
    updateLocalFeedback(reportId, { rating, comment: existingFeedback?.comment || "" });

    try {
      const url = existingFeedback
        ? `http://localhost:3000/api/reportFeedbacks/${existingFeedback.id}`
        : `http://localhost:3000/api/reportFeedbacks/${reportId}`;
      const method = existingFeedback ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment: existingFeedback?.comment || "",
          userId,
        }),
      });
      const data = await res.json();
      if (!existingFeedback && data.feedback?.id) {
        // Assign new ID to feedback in local state
        updateLocalFeedback(reportId, { id: data.feedback.id });
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
    }
  };

  const updateComment = async (reportId, comment) => {
    const existingFeedback = getFeedbackForReport(reportId);
    if (!existingFeedback) return;

    // Update UI immediately
    updateLocalFeedback(reportId, { comment });

    try {
      await fetch(`http://localhost:3000/api/reportFeedbacks/${existingFeedback.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: existingFeedback.rating, comment }),
      });
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  const deleteFeedback = async (reportId) => {
    const existingFeedback = getFeedbackForReport(reportId);
    if (!existingFeedback) return;
    if (!window.confirm("Are you sure you want to delete your feedback?")) return;

    // Remove from UI immediately
    setFeedbacks((prev) => prev.filter((f) => f.reportId !== reportId || f.userId !== userId));

    try {
      await fetch(`http://localhost:3000/api/reportFeedbacks/${existingFeedback.id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
  };

  return (
    <div className="student-container">
      {/* Tabs */}
      <div className="student-cards">
        <div
          className={`card-tab ${viewTab === "reports" ? "active" : ""}`}
          onClick={() => setViewTab("reports")}
        >
          View Reports
        </div>
        <div
          className={`card-tab ${viewTab === "classes" ? "active" : ""}`}
          onClick={() => setViewTab("classes")}
        >
          View Classes
        </div>
      </div>

      {/* Reports Table */}
      {viewTab === "reports" && (
        <table className="report-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Week</th>
              <th>Date</th>
              <th>Course</th>
              <th>Class</th>
              <th>Students Present</th>
              <th>Total Students</th>
              <th>Venue</th>
              <th>Scheduled Time</th>
              <th>Topic</th>
              <th>Learning Outcomes</th>
              <th>Lecturer Recommendations</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => {
              const fb = getFeedbackForReport(r.id) || {};
              return (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.weekOfReporting}</td>
                  <td>{r.dateOfLecture}</td>
                  <td>{r.Course?.name || "N/A"}</td>
                  <td>{r.Class?.name || "N/A"}</td>
                  <td>{r.actualStudentsPresent}</td>
                  <td>{r.totalRegisteredStudents}</td>
                  <td>{r.venue}</td>
                  <td>{r.scheduledTime}</td>
                  <td>{r.topicTaught}</td>
                  <td>{r.learningOutcomes}</td>
                  <td>{r.lecturerRecommendations}</td>
                  <td>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={fb.rating >= star ? "star filled" : "star"}
                          onClick={() => sendRating(r.id, star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={fb.comment || ""}
                      placeholder="Add comment"
                      onChange={(e) => updateComment(r.id, e.target.value)}
                    />
                  </td>
                  <td>
                    {fb.id && <button onClick={() => deleteFeedback(r.id)}>Delete</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Classes Table */}
      {viewTab === "classes" && (
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
      )}
    </div>
  );
}

export default Student;
