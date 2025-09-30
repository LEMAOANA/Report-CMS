import React, { useEffect, useState } from "react";
import "./lecturer.css";
import Navbar from "./navbar";

function LecturerPage() {
  // -------------------- State --------------------
  const [reports, setReports] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);

  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [showReports, setShowReports] = useState(false);

  const [newReport, setNewReport] = useState({
    facultyId: "",
    classId: "",
    courseId: "",
    lecturerId: "",
    weekOfReporting: "",
    dateOfLecture: "",
    actualStudentsPresent: "",
    totalRegisteredStudents: "",
    venue: "",
    scheduledTime: "",
    topicTaught: "",
    learningOutcomes: "",
    lecturerRecommendations: "",
  });

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

  const fetchFaculties = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/faculties");
      const data = await res.json();
      setFaculties(data.faculties || []);
    } catch (err) {
      console.error("Error fetching faculties:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/courses");
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
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

  const fetchLecturers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users");
      const data = await res.json();
      setLecturers(data.users.filter((u) => u.role === "lecture"));
    } catch (err) {
      console.error("Error fetching lecturers:", err);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchFaculties();
    fetchCourses();
    fetchClasses();
    fetchLecturers();
  }, []);

  // -------------------- CRUD Functions --------------------
  const addReport = async () => {
    const values = Object.values(newReport);
    if (values.some((v) => v === "")) return alert("Please fill all fields");

    try {
      const res = await fetch("http://localhost:3000/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport),
      });
      const data = await res.json();
      if (data.status === "success") {
        setNewReport({
          facultyId: "",
          classId: "",
          courseId: "",
          lecturerId: "",
          weekOfReporting: "",
          dateOfLecture: "",
          actualStudentsPresent: "",
          totalRegisteredStudents: "",
          venue: "",
          scheduledTime: "",
          topicTaught: "",
          learningOutcomes: "",
          lecturerRecommendations: "",
        });
        setShowAddReportModal(false);
        fetchReports();
      }
    } catch (err) {
      console.error("Error adding report:", err);
    }
  };

  const updateReport = async (id, updatedFields) => {
    try {
      const res = await fetch(`http://localhost:3000/api/reports/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      const data = await res.json();
      if (data.status === "success") fetchReports();
    } catch (err) {
      console.error("Error updating report:", err);
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/reports/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "success") fetchReports();
    } catch (err) {
      console.error("Error deleting report:", err);
    }
  };

  // -------------------- JSX --------------------
  return (
    <div className="lecturer-page">
      <Navbar/>
      <h2>Lecturer Dashboard</h2>
      <p>Manage your classes and submit reports here.</p>

      {/* Lecturer action buttons */}
      <div className="lecturer-actions">
        <button onClick={() => setShowClasses(!showClasses)}>View Classes</button>
        <button onClick={() => setShowReports(!showReports)}>View Reports</button>
        <button onClick={() => setShowAddReportModal(true)}>Add Report</button>
      </div>

      {/* -------------------- Classes Table -------------------- */}
      {showClasses && (
        <section>
          <h3>All Classes</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Year</th>
                <th>Semester</th>
                <th>Course</th>
                <th>Venue</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cl) => {
                const course = courses.find((c) => c.id === cl.courseId);
                return (
                  <tr key={cl.id}>
                    <td>{cl.id}</td>
                    <td>{cl.name}</td>
                    <td>{cl.year}</td>
                    <td>{cl.semester}</td>
                    <td>{course?.name || "N/A"}</td>
                    <td>{cl.venue}</td>
                    <td>{cl.scheduledTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {/* -------------------- Reports Table -------------------- */}
      {showReports && (
        <section>
          <h3>All Reports</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Faculty</th>
                <th>Class</th>
                <th>Course</th>
                <th>Week</th>
                <th>Date</th>
                <th>Present</th>
                <th>Total Students</th>
                <th>Venue</th>
                <th>Time</th>
                <th>Topic</th>
                <th>Outcomes</th>
                <th>Recommendations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.Faculty?.name || "N/A"}</td>
                  <td>{r.Class?.name || "N/A"}</td>
                  <td>{r.Course?.name || "N/A"}</td>
                  <td>{r.weekOfReporting}</td>
                  <td>{r.dateOfLecture}</td>
                  <td>{r.actualStudentsPresent}</td>
                  <td>{r.totalRegisteredStudents}</td>
                  <td>{r.venue}</td>
                  <td>{r.scheduledTime}</td>
                  <td>{r.topicTaught}</td>
                  <td>{r.learningOutcomes}</td>
                  <td>{r.lecturerRecommendations}</td>
                  <td>
                    <button
                      onClick={() => {
                        const updatedVenue = prompt("Venue:", r.venue) || r.venue;
                        const updatedPresent =
                          prompt("Actual Students Present:", r.actualStudentsPresent) || r.actualStudentsPresent;
                        updateReport(r.id, { venue: updatedVenue, actualStudentsPresent: updatedPresent });
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => deleteReport(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* -------------------- Add Report Modal -------------------- */}
      {showAddReportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Submit New Report</h3>
            <div className="report-form">
              {/* Faculty */}
              <select
                value={newReport.facultyId}
                onChange={(e) => setNewReport({ ...newReport, facultyId: e.target.value })}
              >
                <option value="">Select Faculty</option>
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>

              {/* Class */}
              <select
                value={newReport.classId}
                onChange={(e) => {
                  const selectedClass = classes.find((cl) => cl.id.toString() === e.target.value);
                  setNewReport({
                    ...newReport,
                    classId: e.target.value,
                    courseId: selectedClass?.courseId || "",
                    facultyId: selectedClass?.Course?.facultyId || newReport.facultyId
                  });
                }}
              >
                <option value="">Select Class</option>
                {classes.map((cl) => (
                  <option key={cl.id} value={cl.id}>
                    {cl.name} - {cl.Course?.name}
                  </option>
                ))}
              </select>

              {/* Course */}
              <select
                value={newReport.courseId}
                onChange={(e) => setNewReport({ ...newReport, courseId: e.target.value })}
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              {/* Lecturer */}
              <select
                value={newReport.lecturerId}
                onChange={(e) => setNewReport({ ...newReport, lecturerId: e.target.value })}
              >
                <option value="">Select Lecturer</option>
                {lecturers.map((l) => (
                  <option key={l.id} value={l.id}>{l.username}</option>
                ))}
              </select>

              {/* Other Fields */}
              <input
                type="number"
                placeholder="Week of Reporting"
                value={newReport.weekOfReporting}
                onChange={(e) => setNewReport({ ...newReport, weekOfReporting: e.target.value })}
              />
              <input
                type="date"
                placeholder="Date of Lecture"
                value={newReport.dateOfLecture}
                onChange={(e) => setNewReport({ ...newReport, dateOfLecture: e.target.value })}
              />
              <input
                type="number"
                placeholder="Actual Students Present"
                value={newReport.actualStudentsPresent}
                onChange={(e) => setNewReport({ ...newReport, actualStudentsPresent: e.target.value })}
              />
              <input
                type="number"
                placeholder="Total Registered Students"
                value={newReport.totalRegisteredStudents}
                onChange={(e) => setNewReport({ ...newReport, totalRegisteredStudents: e.target.value })}
              />
              <input
                type="text"
                placeholder="Venue"
                value={newReport.venue}
                onChange={(e) => setNewReport({ ...newReport, venue: e.target.value })}
              />
              <input
                type="time"
                placeholder="Scheduled Time"
                value={newReport.scheduledTime}
                onChange={(e) => setNewReport({ ...newReport, scheduledTime: e.target.value })}
              />
              <input
                type="text"
                placeholder="Topic Taught"
                value={newReport.topicTaught}
                onChange={(e) => setNewReport({ ...newReport, topicTaught: e.target.value })}
              />
              <input
                type="text"
                placeholder="Learning Outcomes"
                value={newReport.learningOutcomes}
                onChange={(e) => setNewReport({ ...newReport, learningOutcomes: e.target.value })}
              />
              <input
                type="text"
                placeholder="Lecturer Recommendations"
                value={newReport.lecturerRecommendations}
                onChange={(e) => setNewReport({ ...newReport, lecturerRecommendations: e.target.value })}
              />

              <div className="modal-buttons">
                <button onClick={addReport}>Submit</button>
                <button onClick={() => setShowAddReportModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LecturerPage;
