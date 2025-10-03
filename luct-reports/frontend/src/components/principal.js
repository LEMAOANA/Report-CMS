import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import './principal.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Principal = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));

  // -------------------- State --------------------
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [reports, setReports] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('courses');
  const [showAddReportModal, setShowAddReportModal] = useState(false);

  const [newReport, setNewReport] = useState({
    facultyId: '',
    classId: '',
    courseId: '',
    lecturerId: currentUser?.id || '',
    weekOfReporting: '',
    dateOfLecture: '',
    actualStudentsPresent: '',
    totalRegisteredStudents: 0,
    venue: '',
    scheduledTime: '',
    topicTaught: '',
    learningOutcomes: '',
    lecturerRecommendations: '',
  });

  // -------------------- Fetch Data --------------------
  useEffect(() => {
    fetchAll();
    fetchUsers();
  }, []);

  const fetchAll = async () => {
    try {
      const [fRes, cRes, clRes, rRes, fbRes] = await Promise.all([
        fetch(`${BASE_URL}/faculties`),
        fetch(`${BASE_URL}/courses`),
        fetch(`${BASE_URL}/classes`),
        fetch(`${BASE_URL}/reports`),
        fetch(`${BASE_URL}/reportFeedbacks`)
      ]);

      const fData = await fRes.json();
      const cData = await cRes.json();
      const clData = await clRes.json();
      const rData = await rRes.json();
      const fbData = await fbRes.json();

      setFaculties(fData.faculties || []);
      setCourses(cData.courses || []);
      setClasses(clData.classes || []);
      setReports(rData.reports || []);
      setFeedbacks(fbData.feedbacks || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // -------------------- Feedback Helpers --------------------
  const getFeedbackForReport = (reportId) =>
    feedbacks.find(f => f.reportId === reportId && f.userId === currentUser?.id);

  const updateLocalFeedback = (reportId, updated) => {
    setFeedbacks(prev => {
      const idx = prev.findIndex(f => f.reportId === reportId && f.userId === currentUser?.id);
      if (idx > -1) {
        const newArr = [...prev];
        newArr[idx] = { ...newArr[idx], ...updated };
        return newArr;
      } else {
        return [...prev, { ...updated, reportId, userId: currentUser?.id, id: updated.id || Math.random() }];
      }
    });
  };

  // -------------------- Actions --------------------
  const sendRating = async (reportId, rating) => {
    const existingFeedback = getFeedbackForReport(reportId);
    updateLocalFeedback(reportId, { rating, comment: existingFeedback?.comment || '' });

    try {
      const url = existingFeedback
        ? `${BASE_URL}/reportFeedbacks/${existingFeedback.id}`
        : `${BASE_URL}/reportFeedbacks/${reportId}`;
      const method = existingFeedback ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment: existingFeedback?.comment || '',
          userId: currentUser?.id,
        }),
      });

      const data = await res.json();
      if (!existingFeedback && data.feedback?.id) {
        updateLocalFeedback(reportId, { id: data.feedback.id });
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
    }
  };

  const submitComment = async (reportId, comment) => {
    const existingFeedback = getFeedbackForReport(reportId);
    if (existingFeedback) {
      updateLocalFeedback(reportId, { comment });
      try {
        await fetch(`${BASE_URL}/reportFeedbacks/${existingFeedback.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating: existingFeedback.rating, comment }),
        });
      } catch (err) {
        console.error('Error updating comment:', err);
      }
    } else {
      updateLocalFeedback(reportId, { comment, rating: 0 });
      try {
        const res = await fetch(`${BASE_URL}/reportFeedbacks/${reportId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comment, rating: 0, userId: currentUser?.id }),
        });
        const data = await res.json();
        if (data.feedback?.id) updateLocalFeedback(reportId, { id: data.feedback.id });
      } catch (err) {
        console.error('Error creating comment:', err);
      }
    }
  };

  const addReport = async () => {
    if (Object.values(newReport).some(v => v === '' || v === 0)) {
      return alert('Please fill all fields correctly.');
    }
    if (parseInt(newReport.actualStudentsPresent) > parseInt(newReport.totalRegisteredStudents)) {
      return alert('Actual students present cannot exceed total registered students.');
    }

    try {
      const res = await fetch(`${BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setShowAddReportModal(false);
        setNewReport({
          facultyId: '',
          classId: '',
          courseId: '',
          lecturerId: currentUser?.id || '',
          weekOfReporting: '',
          dateOfLecture: '',
          actualStudentsPresent: '',
          totalRegisteredStudents: 0,
          venue: '',
          scheduledTime: '',
          topicTaught: '',
          learningOutcomes: '',
          lecturerRecommendations: '',
        });
        fetchAll();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------- Render --------------------
  return (
    <div className="prl-page">

      {/* Tabs / Cards */}
      <div className="prl-actions">
        {['courses', 'classes', 'reports', 'feedbacks'].map(tab => (
          <div
            key={tab}
            className={`prl-card ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'feedbacks' ? 'Ratings' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
        <div className="prl-card add-icon" onClick={() => setShowAddReportModal(true)}>
          <FaPlus style={{ marginRight: '8px' }} /> Add Report
        </div>
      </div>

      {/* Courses Table */}
      {activeTab === 'courses' && (
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Code</th><th>Description</th><th>Faculty</th></tr>
          </thead>
          <tbody>
            {courses.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td><td>{c.name}</td><td>{c.code}</td><td>{c.description}</td>
                <td>{faculties.find(f => f.id === c.facultyId)?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Classes Table */}
      {activeTab === 'classes' && (
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Year</th><th>Semester</th><th>Venue</th><th>Time</th><th>Course</th></tr>
          </thead>
          <tbody>
            {classes.map(cl => (
              <tr key={cl.id}>
                <td>{cl.id}</td><td>{cl.name}</td><td>{cl.year}</td><td>{cl.semester}</td>
                <td>{cl.venue}</td><td>{cl.scheduledTime}</td>
                <td>{courses.find(c => c.id === cl.courseId)?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Reports Table */}
      {activeTab === 'reports' && (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Week</th><th>Date</th><th>Topic</th><th>Learning Outcomes</th>
              <th>Recommendations</th><th>Faculty</th><th>Class</th><th>Course</th><th>Lecturer</th>
              <th>Actual</th><th>Total</th><th>Rating</th><th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => {
              const lecturerName = users.find(u => u.id === r.lecturerId)?.username || 'N/A';
              const fb = getFeedbackForReport(r.id) || {};
              return (
                <tr key={r.id}>
                  <td>{r.id}</td><td>{r.weekOfReporting}</td><td>{r.dateOfLecture}</td>
                  <td>{r.topicTaught}</td><td>{r.learningOutcomes}</td><td>{r.lecturerRecommendations}</td>
                  <td>{faculties.find(f => f.id === r.facultyId)?.name}</td>
                  <td>{classes.find(cl => cl.id === r.classId)?.name}</td>
                  <td>{courses.find(c => c.id === r.courseId)?.name}</td>
                  <td>{lecturerName}</td>
                  <td>{r.actualStudentsPresent}</td>
                  <td>{r.totalRegisteredStudents}</td>
                  <td>
                    {[1,2,3,4,5].map(star => (
                      <span
                        key={star}
                        className={fb.rating >= star ? "star filled" : "star"}
                        onClick={() => sendRating(r.id, star)}
                      >★</span>
                    ))}
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Add comment"
                      defaultValue={fb.comment || ""}
                      onBlur={(e) => submitComment(r.id, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') submitComment(r.id, e.target.value); }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Feedbacks Table */}
      {activeTab === 'feedbacks' && (
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Report</th><th>User</th><th>Rating</th><th>Comment</th></tr>
          </thead>
          <tbody>
            {feedbacks.map(fb => {
              const userName = users.find(u => u.id === fb.userId)?.username || 'N/A';
              const reportTopic = reports.find(r => r.id === fb.reportId)?.topicTaught || 'N/A';
              return (
                <tr key={fb.id}>
                  <td>{fb.id}</td>
                  <td>{reportTopic}</td>
                  <td>{userName}</td>
                  <td>{fb.rating}</td>
                  <td>{fb.comment}</td>
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
};

export default Principal;
