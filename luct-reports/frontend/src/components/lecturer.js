import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai"; // Plus icon
import "./lecturer.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

function LecturerPage() {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // -------------------- State --------------------
  const [reports, setReports] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("classes"); // "classes", "reports", "feedbacks"
  const [showAddReportModal, setShowAddReportModal] = useState(false);

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

  const deleteReport = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      const res = await fetch(`${BASE_URL}/reports/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "success") fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------- Render --------------------
  return (
    <div className="lecturer-container">
      {/* Tabs */}
      <div className="lecturer-cards">
        {["classes", "reports", "feedbacks"].map((tab) => (
          <div
            key={tab}
            className={`card-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "classes" ? "Classes" : tab === "reports" ? "Reports" : "Ratings"}
          </div>
        ))}

        {/* Add Report Icon */}
        <div
          className="card-tab add-icon"
          title="Add Report"
          onClick={() => setShowAddReportModal(true)}
        >
          <AiOutlinePlus size={20} />
        </div>
      </div>

      {/* Classes Table */}
      {activeTab === "classes" && (
        <table className="report-table">
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
            {classes
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
        <table className="report-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Faculty</th>
              <th>Class</th>
              <th>Course</th>
              <th>Lecturer</th>
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
            {reports
              .filter((r) => r.lecturerId === currentUser?.id)
              .map((r) => {
                const lecturerName =
                  lecturers.find((l) => l.id === r.lecturerId)?.username ||
                  currentUser?.username ||
                  "N/A";
                return (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.Faculty?.name || "N/A"}</td>
                    <td>{r.Class?.name || "N/A"}</td>
                    <td>{r.Course?.name || "N/A"}</td>
                    <td>{lecturerName}</td>
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
                          const updatedVenue =
                            prompt("Venue:", r.venue) || r.venue;
                          const updatedPresent =
                            prompt(
                              "Actual Students Present:",
                              r.actualStudentsPresent
                            ) || r.actualStudentsPresent;
                          updateReport(r.id, {
                            venue: updatedVenue,
                            actualStudentsPresent: updatedPresent,
                          });
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}

      {/* Feedback Table */}
      {activeTab === "feedbacks" && (
        <table className="report-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Report Topic</th>
              <th>Week</th>
              <th>Date</th>
              <th>Score</th>
              <th>Feedback</th>
              <th>Rated By</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks
              .filter((f) =>
                reports.some(
                  (r) => r.id === f.reportId && r.lecturerId === currentUser?.id
                )
              )
              .map((f) => {
                const report = reports.find((r) => r.id === f.reportId);
                const rater = users.find((u) => u.id === f.userId);
                return (
                  <tr key={f.id}>
                    <td>{f.id}</td>
                    <td>{report?.topicTaught || "N/A"}</td>
                    <td>{report?.weekOfReporting || "N/A"}</td>
                    <td>{report?.dateOfLecture || "N/A"}</td>
                    <td>{f.rating || "N/A"}</td>
                    <td>{f.comment || "N/A"}</td>
                    <td>{rater?.username || "N/A"}</td>
                    <td>{new Date(f.createdAt).toLocaleString()}</td>
                    <td>{new Date(f.updatedAt).toLocaleString()}</td>
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
              {/* Class Selection */}
              <select
                value={newReport.classId}
                onChange={(e) => {
                  const selectedClassId = parseInt(e.target.value);
                  const selectedClass = classes.find((cl) => cl.id === selectedClassId);
                  const selectedCourse = courses.find(
                    (c) => c.id === selectedClass?.courseId
                  );
                  const studentCount = users.filter((u) => u.role === "student").length;

                  setNewReport({
                    ...newReport,
                    classId: selectedClassId,
                    courseId: selectedCourse?.id || "",
                    facultyId: selectedCourse?.facultyId || "",
                    venue: selectedClass?.venue || "",
                    scheduledTime: selectedClass?.scheduledTime || "",
                    totalRegisteredStudents: studentCount || 0,
                  });
                }}
              >
                <option value="">Select Your Class</option>
                {classes
                  .filter((cl) => cl.lecturerId === currentUser?.id)
                  .map((cl) => (
                    <option key={cl.id} value={cl.id}>
                      {cl.name}
                    </option>
                  ))}
              </select>

              {/* Display Faculty and Course */}
              <input
                type="text"
                value={
                  faculties.find((f) => f.id === newReport.facultyId)?.name || ""
                }
                disabled
                placeholder="Faculty"
              />
              <input
                type="text"
                value={
                  courses.find((c) => c.id === newReport.courseId)?.name || ""
                }
                disabled
                placeholder="Course"
              />
              <input
                type="text"
                value={currentUser?.username || ""}
                disabled
                placeholder="Lecturer"
              />

              {/* Report Details */}
              <input
                type="number"
                placeholder="Week of Reporting"
                value={newReport.weekOfReporting}
                onChange={(e) =>
                  setNewReport({ ...newReport, weekOfReporting: e.target.value })
                }
              />
              <input
                type="date"
                placeholder="Date of Lecture"
                value={newReport.dateOfLecture}
                onChange={(e) =>
                  setNewReport({ ...newReport, dateOfLecture: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Actual Students Present"
                value={newReport.actualStudentsPresent}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    actualStudentsPresent: e.target.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="Total Students"
                value={newReport.totalRegisteredStudents || 0}
                readOnly
              />
              <input
                type="text"
                placeholder="Venue"
                value={newReport.venue}
                onChange={(e) =>
                  setNewReport({ ...newReport, venue: e.target.value })
                }
              />
              <input
                type="time"
                placeholder="Scheduled Time"
                value={newReport.scheduledTime}
                onChange={(e) =>
                  setNewReport({ ...newReport, scheduledTime: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Topic Taught"
                value={newReport.topicTaught}
                onChange={(e) =>
                  setNewReport({ ...newReport, topicTaught: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Learning Outcomes"
                value={newReport.learningOutcomes}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    learningOutcomes: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Lecturer Recommendations"
                value={newReport.lecturerRecommendations}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    lecturerRecommendations: e.target.value,
                  })
                }
              />

              {/* Modal Buttons */}
              <div className="modal-buttons">
                <button onClick={addReport}>Submit</button>
                <button onClick={() => setShowAddReportModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LecturerPage;
