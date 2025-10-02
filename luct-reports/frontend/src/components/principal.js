import React, { useEffect, useState } from 'react';
import './principal.css';

const Principal = () => {
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [reports, setReports] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeTable, setActiveTable] = useState(null);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fRes, cRes, clRes, rRes, fbRes] = await Promise.all([
        fetch(`${BASE_URL}/faculties`),
        fetch(`${BASE_URL}/courses`),
        fetch(`${BASE_URL}/classes`),
        fetch(`${BASE_URL}/reports`),
        fetch(`${BASE_URL}/reportFeedbacks`),
      ]);

      const fData = await fRes.json();
      const cData = await cRes.json();
      const clData = await clRes.json();
      const rData = await rRes.json();
      const fbData = await fbRes.json();

      setFaculties(fData.faculties);
      setCourses(cData.courses);
      setClasses(clData.classes);
      setReports(rData.reports);
      setFeedbacks(fbData.feedbacks);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleShowTable = (table) => setActiveTable(table);

  // -------------------- Feedback Helpers --------------------
  const getFeedbackForReport = (reportId) =>
    feedbacks.find(f => f.reportId === reportId && f.userId === userId);

  const updateLocalFeedback = (reportId, updated) => {
    setFeedbacks(prev => {
      const idx = prev.findIndex(f => f.reportId === reportId && f.userId === userId);
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
          userId,
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
      // Update existing comment
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
      // Create new feedback with empty rating
      updateLocalFeedback(reportId, { comment, rating: 0 });
      try {
        const res = await fetch(`${BASE_URL}/reportFeedbacks/${reportId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comment, rating: 0, userId }),
        });
        const data = await res.json();
        if (data.feedback?.id) {
          updateLocalFeedback(reportId, { id: data.feedback.id });
        }
      } catch (err) {
        console.error('Error creating comment:', err);
      }
    }
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await fetch(`${BASE_URL}/reportFeedbacks/${id}`, { method: 'DELETE' });
      setFeedbacks(prev => prev.filter(fb => fb.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="prl-page">
      <div className="prl-actions">
        <div className="prl-card" onClick={() => handleShowTable('faculties')}>Faculties</div>
        <div className="prl-card" onClick={() => handleShowTable('courses')}>Courses</div>
        <div className="prl-card" onClick={() => handleShowTable('classes')}>Classes</div>
        <div className="prl-card" onClick={() => handleShowTable('reports')}>Reports</div>
        <div className="prl-card" onClick={() => handleShowTable('feedbacks')}>Ratings</div>
      </div>

      {/* Faculties Table */}
      {activeTable === 'faculties' && (
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Created At</th><th>Updated At</th></tr>
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

      {/* Courses Table */}
      {activeTable === 'courses' && (
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Code</th><th>Description</th><th>Faculty</th></tr>
          </thead>
          <tbody>
            {courses.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td><td>{c.name}</td><td>{c.code}</td><td>{c.description}</td>
                <td>{c.Faculty?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Classes Table */}
      {activeTable === 'classes' && (
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Year</th><th>Semester</th><th>Venue</th><th>Time</th><th>Course</th></tr>
          </thead>
          <tbody>
            {classes.map(cl => (
              <tr key={cl.id}>
                <td>{cl.id}</td><td>{cl.name}</td><td>{cl.year}</td><td>{cl.semester}</td>
                <td>{cl.venue}</td><td>{cl.scheduledTime}</td><td>{cl.Course?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Reports Table with Rating Stars and Comment */}
      {activeTable === 'reports' && (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Week</th><th>Date</th><th>Topic</th><th>Learning Outcomes</th>
              <th>Recommendations</th><th>Faculty</th><th>Class</th><th>Course</th>
              <th>Lecturer</th><th>Rating</th><th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => {
              const fb = getFeedbackForReport(r.id) || {};
              return (
                <tr key={r.id}>
                  <td>{r.id}</td><td>{r.weekOfReporting}</td><td>{r.dateOfLecture}</td>
                  <td>{r.topicTaught}</td><td>{r.learningOutcomes}</td><td>{r.lecturerRecommendations}</td>
                  <td>{r.Faculty?.name}</td><td>{r.Class?.name}</td><td>{r.Course?.name}</td>
                  <td>{r.lecturer?.username}</td>
                  <td>
                    <div className="star-rating">
                      {[1,2,3,4,5].map(star => (
                        <span
                          key={star}
                          className={fb.rating >= star ? "star filled" : "star"}
                          onClick={() => sendRating(r.id, star)}
                        >★</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Add comment"
                      defaultValue=""
                      onBlur={(e) => submitComment(r.id, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') submitComment(r.id, e.target.value); }}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      {/* Feedbacks Table */}
      {activeTable === 'feedbacks' && (
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Report</th><th>User</th><th>Rating</th><th>Comment</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {feedbacks.map(fb => (
              <tr key={fb.id}>
                <td>{fb.id}</td>
                <td>{fb.Report?.topicTaught}</td>
                <td>{fb.User?.username}</td>
                <td>{fb.rating}</td>
                <td>{fb.comment}</td>
                <td><button onClick={() => deleteFeedback(fb.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Principal;
