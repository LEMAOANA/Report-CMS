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
  const [activeTab, setActiveTab] = useState("classes");
  const [showAddReportModal, setShowAddReportModal] = useState(false);

  // Search text for each tab
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
    <div className="lecturer-container">
      {/* Tabs */}
      <div className="lecturer-cards">
        {["classes", "reports", "feedbacks"].map((tab) => (
          <div
            key={tab}
            className={`card-tab ${activeTab === tab ? "active" : ""}`}
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

        {/* Add Report Icon */}
        <div
          className="card-tab add-icon"
          title="Add Report"
          onClick={() => setShowAddReportModal(true)}
        >
          <AiOutlinePlus size={20} />
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder={`Search in ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
                      onClick={() => {
                        const updatedVenue =
                          prompt("Venue:", r.venue) || r.venue;
                        updateReport(r.id, { venue: updatedVenue });
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {/* Feedbacks Table */}
      {activeTab === "feedbacks" && (
        <table className="report-table">
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
    </div>
  );
}

export default LecturerPage;
