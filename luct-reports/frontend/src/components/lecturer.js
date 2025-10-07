import React, { useEffect, useState } from "react";
import { AiOutlinePlus, AiOutlineDownload, AiOutlineEdit } from "react-icons/ai";
import "./lecturer.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

function LecturerPage() {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [reports, setReports] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("classes");
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newReport, setNewReport] = useState({
    facultyId: "",
    classId: "",
    courseId: "",
    lecturerId: currentUser?.id || "",
    weekOfReporting: "",
    dateOfLecture: "",
    actualStudentsPresent: "",
    totalRegisteredStudents: 0,
    venue: "",
    scheduledTime: "",
    topicTaught: "",
    learningOutcomes: "",
    lecturerRecommendations: "",
  });

  // -------------------- Fetch Functions --------------------
  const fetchReports = async () => {
    try {
      const res = await fetch(`${BASE_URL}/reports`);
      const data = await res.json();
      setReports(data.reports || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(`${BASE_URL}/reportFeedbacks`);
      const data = await res.json();
      setFeedbacks(data.feedbacks || []);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  const fetchFaculties = async () => {
    try {
      const res = await fetch(`${BASE_URL}/faculties`);
      const data = await res.json();
      setFaculties(data.faculties || []);
    } catch (err) {
      console.error("Error fetching faculties:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/courses`);
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/classes`);
      const data = await res.json();
      setClasses(data.classes || []);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  const fetchLecturers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users`);
      const data = await res.json();
      setLecturers(data.users.filter((u) => u.role === "lecturer"));
    } catch (err) {
      console.error("Error fetching lecturers:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchFeedbacks();
    fetchFaculties();
    fetchCourses();
    fetchClasses();
    fetchLecturers();
    fetchUsers();
  }, []);

  // -------------------- CRUD Operations --------------------
  const addReport = async () => {
    if (Object.values(newReport).some((v) => v === "")) {
      return alert("Please fill all fields");
    }
    try {
      const res = await fetch(`${BASE_URL}/reports`, {
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
          lecturerId: currentUser?.id || "",
          weekOfReporting: "",
          dateOfLecture: "",
          actualStudentsPresent: "",
          totalRegisteredStudents: 0,
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
      console.error(err);
    }
  };

  const updateReport = async (id, updatedFields) => {
    try {
      const res = await fetch(`${BASE_URL}/reports/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      const data = await res.json();
      if (data.status === "success") fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------- CSV Download --------------------
  const downloadCSV = (data, filename) => {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) => headers.map((h) => `"${row[h] ?? ""}"`).join(",")),
    ];
    const csvData = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(csvData);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // -------------------- Search Filtering --------------------
  const filteredClasses = classes.filter((cl) => {
    const search = searchTerm.toLowerCase();
    return (
      cl.name.toLowerCase().includes(search) ||
      cl.year.toString().includes(search) ||
      cl.semester.toString().includes(search) ||
      cl.venue.toLowerCase().includes(search)
    );
  });

  const filteredReports = reports.filter((r) => {
    const search = searchTerm.toLowerCase();
    return (
      r.topicTaught?.toLowerCase().includes(search) ||
      r.learningOutcomes?.toLowerCase().includes(search) ||
      r.venue?.toLowerCase().includes(search) ||
      r.weekOfReporting?.toString().includes(search)
    );
  });

  const filteredFeedbacks = feedbacks.filter((f) => {
    const search = searchTerm.toLowerCase();
    const report = reports.find((r) => r.id === f.reportId);
    const rater = users.find((u) => u.id === f.userId);
    return (
      report?.topicTaught?.toLowerCase().includes(search) ||
      f.comment?.toLowerCase().includes(search) ||
      rater?.username?.toLowerCase().includes(search)
    );
  });

  // -------------------- Render --------------------
  return (
    <div className="prl-page">
      {/* Tabs */}
      <div className="prl-actions">
        {["classes", "reports", "feedbacks"].map((tab) => (
          <div
            key={tab}
            className={`prl-card ${activeTab === tab ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab);
              setSearchTerm("");
            }}
          >
            {tab === "classes"
              ? "Classes"
              : tab === "reports"
              ? "Reports"
              : "Ratings"}
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="search-bar" style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder={`Search in ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Header Actions */}
      {(activeTab === "reports" || activeTab === "feedbacks") && (
        <div className="reports-header">
          {activeTab === "reports" && (
            <>
              <button className="btn-add" onClick={() => setShowAddReportModal(true)}>
                <AiOutlinePlus />
              </button>
              <button
                className="btn-download"
                onClick={() => downloadCSV(filteredReports, "reports.csv")}
              >
                <AiOutlineDownload />
                CSV
              </button>
            </>
          )}
          {activeTab === "feedbacks" && (
            <button
              className="btn-download"
              onClick={() => downloadCSV(filteredFeedbacks, "ratings.csv")}
            >
              <AiOutlineDownload />
              CSV
            </button>
          )}
        </div>
      )}

      {/* Classes Table */}
      {activeTab === "classes" && (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Year</th>
              <th>Semester</th>
              <th>Venue</th>
              <th>Time</th>
              <th>Total Students</th>
              <th>Course</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses
              .filter((cl) => cl.lecturerId === currentUser?.id)
              .map((cl) => {
                const course = courses.find((c) => c.id === cl.courseId);
                return (
                  <tr key={cl.id}>
                    <td>{cl.id}</td>
                    <td>{cl.name}</td>
                    <td>{cl.year}</td>
                    <td>{cl.semester}</td>
                    <td>{cl.venue}</td>
                    <td>{cl.scheduledTime}</td>
                    <td>{cl.totalStudents}</td>
                    <td>{course?.name || "N/A"}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}

      {/* Reports Table */}
      {activeTab === "reports" && (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Faculty</th>
              <th>Class</th>
              <th>Course</th>
              <th>Week</th>
              <th>Date</th>
              <th>Present</th>
              <th>Venue</th>
              <th>Topic</th>
              <th>Outcomes</th>
              <th>Recommendations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports
              .filter((r) => r.lecturerId === currentUser?.id)
              .map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.Faculty?.name || "N/A"}</td>
                  <td>{r.Class?.name || "N/A"}</td>
                  <td>{r.Course?.name || "N/A"}</td>
                  <td>{r.weekOfReporting}</td>
                  <td>{r.dateOfLecture}</td>
                  <td>{r.actualStudentsPresent}</td>
                  <td>{r.venue}</td>
                  <td>{r.topicTaught}</td>
                  <td>{r.learningOutcomes}</td>
                  <td>{r.lecturerRecommendations}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => {
                        const updatedVenue =
                          prompt("Venue:", r.venue) || r.venue;
                        updateReport(r.id, { venue: updatedVenue });
                      }}
                    >
                      <AiOutlineEdit />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {/* Feedbacks Table */}
      {activeTab === "feedbacks" && (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Topic</th>
              <th>Week</th>
              <th>Score</th>
              <th>Comment</th>
              <th>Rated By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.map((f) => {
              const report = reports.find((r) => r.id === f.reportId);
              const rater = users.find((u) => u.id === f.userId);
              return (
                <tr key={f.id}>
                  <td>{f.id}</td>
                  <td>{report?.topicTaught || "N/A"}</td>
                  <td>{report?.weekOfReporting || "N/A"}</td>
                  <td>{f.rating || "N/A"}</td>
                  <td>{f.comment || "N/A"}</td>
                  <td>{rater?.username || "N/A"}</td>
                  <td>{new Date(f.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {/* Add Report Modal */}
      {showAddReportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Submit New Report</h3>
            <div className="report-form">
              <select
                value={newReport.classId}
                onChange={e => {
                  const classId = parseInt(e.target.value);
                  const selectedClass = classes.find(cl => cl.id === classId);
                  const course = courses.find(c => c.id === selectedClass?.courseId);
                  setNewReport({
                    ...newReport,
                    classId: classId,
                    courseId: course?.id || '',
                    facultyId: course?.facultyId || '',
                    venue: selectedClass?.venue || '',
                    scheduledTime: selectedClass?.scheduledTime || '',
                    totalRegisteredStudents: selectedClass?.totalStudents || 0,
                  });
                }}
              >
                <option value="">Select Class</option>
                {classes.map(cl => (
                  <option key={cl.id} value={cl.id}>{cl.name}</option>
                ))}
              </select>

              <input type="text" placeholder="Faculty" value={faculties.find(f => f.id === newReport.facultyId)?.name || ''} disabled />
              <input type="text" placeholder="Course" value={courses.find(c => c.id === newReport.courseId)?.name || ''} disabled />
              <input type="text" placeholder="Lecturer" value={currentUser?.username || ''} disabled />

              <input type="number" placeholder="Week of Reporting" value={newReport.weekOfReporting} onChange={e => setNewReport({...newReport, weekOfReporting: e.target.value})} />
              <input type="date" placeholder="Date of Lecture" value={newReport.dateOfLecture} onChange={e => setNewReport({...newReport, dateOfLecture: e.target.value})} />
              <input type="number" placeholder="Actual Students Present" value={newReport.actualStudentsPresent} onChange={e => setNewReport({...newReport, actualStudentsPresent: e.target.value})} />
              <input type="number" placeholder="Total Registered Students" value={newReport.totalRegisteredStudents} onChange={e => setNewReport({...newReport, totalRegisteredStudents: e.target.value})}/>
              <input type="text" placeholder="Venue" value={newReport.venue} onChange={e => setNewReport({...newReport, venue: e.target.value})} />
              <input type="time" placeholder="Scheduled Time" value={newReport.scheduledTime} onChange={e => setNewReport({...newReport, scheduledTime: e.target.value})} />
              <input type="text" placeholder="Topic Taught" value={newReport.topicTaught} onChange={e => setNewReport({...newReport, topicTaught: e.target.value})} />
              <input type="text" placeholder="Learning Outcomes" value={newReport.learningOutcomes} onChange={e => setNewReport({...newReport, learningOutcomes: e.target.value})} />
              <input type="text" placeholder="Recommendations" value={newReport.lecturerRecommendations} onChange={e => setNewReport({...newReport, lecturerRecommendations: e.target.value})} />

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
