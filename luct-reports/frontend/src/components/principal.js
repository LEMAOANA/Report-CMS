import React, { useEffect, useState } from 'react';
import './principal.css';

const Principal = () => {
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [reports, setReports] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeTable, setActiveTable] = useState(null);
  const [feedbackData, setFeedbackData] = useState({ rating: '', comment: '', reportId: null });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const fRes = await fetch('http://localhost:3000/api/faculties');
      const fData = await fRes.json();
      setFaculties(fData.faculties);

      const cRes = await fetch('http://localhost:3000/api/courses');
      const cData = await cRes.json();
      setCourses(cData.courses);

      const clRes = await fetch('http://localhost:3000/api/classes');
      const clData = await clRes.json();
      setClasses(clData.classes);

      const rRes = await fetch('http://localhost:3000/api/reports');
      const rData = await rRes.json();
      setReports(rData.reports);

      const fbRes = await fetch('http://localhost:3000/api/reportFeedback');
      const fbData = await fbRes.json();
      setFeedbacks(fbData.feedbacks);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleShowTable = (table) => {
    setActiveTable(table);
  };

  const handleFeedbackChange = (e) => {
    setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });
  };

  const submitFeedback = async () => {
    if (!feedbackData.reportId) return alert('Select a report first!');
    try {
      await fetch(`http://localhost:3000/api/reportFeedback/${feedbackData.reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: feedbackData.rating, comment: feedbackData.comment }),
      });
      alert('Feedback submitted!');
      setFeedbackData({ rating: '', comment: '', reportId: null });
      fetchData(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="prl-page">

      <div className="prl-actions">
        <div className="prl-card" onClick={() => handleShowTable('faculties')}>
          Faculties
          <p className="card-desc">View all faculties</p>
        </div>
        <div className="prl-card" onClick={() => handleShowTable('courses')}>
          Courses
          <p className="card-desc">View all courses</p>
        </div>
        <div className="prl-card" onClick={() => handleShowTable('classes')}>
          Classes
          <p className="card-desc">View all classes</p>
        </div>
        <div className="prl-card" onClick={() => handleShowTable('reports')}>
          Reports
          <p className="card-desc">View reports & add feedback</p>
        </div>
      </div>

      {/* Tables Rendering */}
      {activeTable === 'faculties' && (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {faculties.map(f => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.name}</td>
                <td>{new Date(f.createdAt).toLocaleString()}</td>
                <td>{new Date(f.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTable === 'courses' && (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Code</th>
              <th>Description</th>
              <th>Faculty</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.code}</td>
                <td>{c.description}</td>
                <td>{c.Faculty?.name}</td>
                <td>{new Date(c.createdAt).toLocaleString()}</td>
                <td>{new Date(c.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTable === 'classes' && (
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
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {classes.map(cl => (
              <tr key={cl.id}>
                <td>{cl.id}</td>
                <td>{cl.name}</td>
                <td>{cl.year}</td>
                <td>{cl.semester}</td>
                <td>{cl.venue}</td>
                <td>{cl.scheduledTime}</td>
                <td>{cl.totalRegisteredStudents}</td>
                <td>{cl.Course?.name}</td>
                <td>{new Date(cl.createdAt).toLocaleString()}</td>
                <td>{new Date(cl.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTable === 'reports' && (
        <div>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Week</th>
                <th>Date</th>
                <th>Topic</th>
                <th>Learning Outcomes</th>
                <th>Recommendations</th>
                <th>Faculty</th>
                <th>Class</th>
                <th>Course</th>
                <th>Lecturer</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.weekOfReporting}</td>
                  <td>{r.dateOfLecture}</td>
                  <td>{r.topicTaught}</td>
                  <td>{r.learningOutcomes}</td>
                  <td>{r.lecturerRecommendations}</td>
                  <td>{r.Faculty?.name}</td>
                  <td>{r.Class?.name}</td>
                  <td>{r.Course?.name}</td>
                  <td>{r.lecturer?.username}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Feedback Form */}
          <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
            <h3>Submit Feedback for a Report</h3>
            <select
              name="reportId"
              value={feedbackData.reportId || ''}
              onChange={handleFeedbackChange}
              className="feedback-input"
            >
              <option value="">Select Report</option>
              {reports.map(r => (
                <option key={r.id} value={r.id}>
                  {`Report ${r.id} - ${r.topicTaught}`}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="rating"
              placeholder="Rating (1-5)"
              value={feedbackData.rating}
              onChange={handleFeedbackChange}
              className="feedback-input"
            />
            <textarea
              name="comment"
              placeholder="Comment"
              value={feedbackData.comment}
              onChange={handleFeedbackChange}
              className="feedback-textarea"
              rows={3}
            />
            <button className="feedback-submit" onClick={submitFeedback}>
              Submit Feedback
            </button>
          </div>

          {/* Feedback List */}
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Report</th>
                <th>User</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map(fb => (
                <tr key={fb.id}>
                  <td>{fb.id}</td>
                  <td>{fb.Report?.topicTaught}</td>
                  <td>{fb.User?.username}</td>
                  <td>{fb.rating}</td>
                  <td>{fb.comment}</td>
                  <td>{new Date(fb.createdAt).toLocaleString()}</td>
                  <td>{new Date(fb.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Principal;
