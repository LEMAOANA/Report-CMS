import React, { useEffect, useState } from 'react';
import { FaPlusCircle, FaEdit, FaTrash, FaStar, FaDownload } from 'react-icons/fa';
import './leader.css';

const ProgramLeader = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));

  // -------------------- Data States --------------------
  const [faculties, setFaculties] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [reports, setReports] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  // -------------------- View State --------------------
  const [view, setView] = useState('faculties'); // 'faculties', 'courses', 'classes', 'reports'

  // -------------------- Modal States --------------------
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3000/api';

  // -------------------- Fetch Functions --------------------
  const fetchFaculties = async () => {
    try {
      const res = await fetch(`${BASE_URL}/faculties`);
      const data = await res.json();
      setFaculties(data.faculties || []);
    } catch (error) {
      console.error('Error fetching faculties:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/courses`);
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/classes`);
      const data = await res.json();
      setClasses(data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch(`${BASE_URL}/reports?lecturerId=${currentUser?.id}`);
      const data = await res.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(`${BASE_URL}/reportFeedbacks`);
      const data = await res.json();
      setFeedbacks(data.feedbacks || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  useEffect(() => {
    fetchFaculties();
    fetchUsers();
    fetchCourses();
    fetchClasses();
    fetchReports();
    fetchFeedbacks();
  }, []);

  // -------------------- CRUD Functions --------------------
  const saveFaculty = async (id) => {
    if (!modalData.name?.trim()) return alert('Enter faculty name');
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${BASE_URL}/faculties/${id}` : `${BASE_URL}/faculties`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: modalData.name }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        fetchFaculties();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving faculty:', error);
    }
  };

  const saveCourse = async (id) => {
    const { name, code, description, facultyId, programLeaderId, principalLecturerId } = modalData;
    if (!name || !code || !facultyId) return alert('Fill in required fields');
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${BASE_URL}/courses/${id}` : `${BASE_URL}/courses`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, code, description, facultyId, programLeaderId, principalLecturerId }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        fetchCourses();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const saveClass = async (id) => {
    const { name, year, semester, venue, scheduledTime, courseId, lecturerId, totalRegisteredStudents } = modalData;
    if (!name || !year || !semester || !venue || !scheduledTime || !courseId || !lecturerId)
      return alert('Fill in all fields');

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${BASE_URL}/classes/${id}` : `${BASE_URL}/classes`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modalData),
      });
      const data = await res.json();
      if (data.status === 'success') {
        fetchClasses();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`${BASE_URL}/${type}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.status === 'success') {
        if (type === 'faculties') fetchFaculties();
        if (type === 'courses') fetchCourses();
        if (type === 'classes') fetchClasses();
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  // -------------------- Modal Handlers --------------------
  const openModal = (type, data = {}, editing = false) => {
    if (type === 'class' && !editing) {
      data.totalRegisteredStudents = users.filter(u => u.role === 'student').length;
    }
    setModalData(data);
    setIsEditing(editing);
    if (type === 'faculty') setShowFacultyModal(true);
    if (type === 'course') setShowCourseModal(true);
    if (type === 'class') setShowClassModal(true);
  };

  const closeModal = () => {
    setModalData({});
    setIsEditing(false);
    setShowFacultyModal(false);
    setShowCourseModal(false);
    setShowClassModal(false);
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

  // -------------------- CSV Export --------------------
  const downloadCSV = () => {
    if (!reports.length) return;
    const headers = [
      'ID', 'Faculty', 'Course', 'Class', 'Date of Lecture',
      'Week of Reporting', 'Actual Students Present', 'Total Registered Students',
      'Venue', 'Scheduled Time', 'Topic Taught', 'Learning Outcomes', 'Lecturer Recommendations'
    ];
    const rows = reports.map(r => [
      r.id,
      r.facultyName || '',
      r.courseName || '',
      r.className || '',
      r.dateOfLecture || '',
      r.weekOfReporting || '',
      r.actualStudentsPresent || '',
      r.totalRegisteredStudents || '',
      r.venue || '',
      r.scheduledTime || '',
      r.topicTaught || '',
      r.learningOutcomes || '',
      r.lecturerRecommendations || ''
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'reports.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -------------------- Render Reports --------------------
  const renderReports = () => (
    <>
      <button className="download-btn" onClick={downloadCSV}>
        <FaDownload /> Download CSV
      </button>
      <table className="faculty-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Faculty</th>
            <th>Course</th>
            <th>Class</th>
            <th>Date</th>
            <th>Topic</th>
            <th>Attendance</th>
            <th>Rating</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => {
            const feedback = getFeedbackForReport(report.id) || {};
            return (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.facultyName}</td>
                <td>{report.courseName}</td>
                <td>{report.className}</td>
                <td>{report.dateOfLecture}</td>
                <td>{report.topicTaught}</td>
                <td>{report.actualStudentsPresent}/{report.totalRegisteredStudents}</td>
                <td>
                  {[1,2,3,4,5].map(star => (
                    <FaStar
                      key={star}
                      color={star <= (feedback.rating || 0) ? '#ffc107' : '#e4e5e9'}
                      onClick={() => sendRating(report.id, star)}
                      style={{ cursor: 'pointer', marginRight: 2 }}
                    />
                  ))}
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Add comment"
                    value={feedback.comment || ''}
                    onChange={e => submitComment(report.id, e.target.value)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );

  // -------------------- Render Table --------------------
  const renderTable = () => {
    switch (view) {
      case 'faculties':
      case 'courses':
      case 'classes':
        return renderCurrentCRUDTable();
      case 'reports':
        return renderReports();
      default:
        return null;
    }
  };

  const renderCurrentCRUDTable = () => {
    switch (view) {
      case 'faculties':
        return (
          <table className="faculty-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>
                  <FaPlusCircle className="add-icon" title="Add Faculty" onClick={() => openModal('faculty')} />
                </th>
              </tr>
            </thead>
            <tbody>
              {faculties.map(f => (
                <tr key={f.id}>
                  <td>{f.id}</td>
                  <td>{f.name}</td>
                  <td>{new Date(f.createdAt).toLocaleString()}</td>
                  <td>{new Date(f.updatedAt).toLocaleString()}</td>
                  <td>
                    <FaEdit className="action-icon" onClick={() => openModal('faculty', f, true)} />
                    <FaTrash className="action-icon" onClick={() => deleteItem('faculties', f.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'courses':
        return (
          <table className="faculty-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Code</th>
                <th>Faculty</th>
                <th>Program Leader</th>
                <th>Principal Lecturer</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>
                  <FaPlusCircle className="add-icon" title="Add Course" onClick={() => openModal('course')} />
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.code}</td>
                  <td>{c.Faculty?.name || 'N/A'}</td>
                  <td>{c.ProgramLeader?.username || 'N/A'}</td>
                  <td>{c.PrincipalLecturer?.username || 'N/A'}</td>
                  <td>{new Date(c.createdAt).toLocaleString()}</td>
                  <td>{new Date(c.updatedAt).toLocaleString()}</td>
                  <td>
                    <FaEdit className="action-icon" onClick={() => openModal('course', c, true)} />
                    <FaTrash className="action-icon" onClick={() => deleteItem('courses', c.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'classes':
        return (
          <table className="faculty-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Course</th>
                <th>Lecturer</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>
                  <FaPlusCircle className="add-icon" title="Add Class" onClick={() => openModal('class')} />
                </th>
              </tr>
            </thead>
            <tbody>
              {classes.map(cls => (
                <tr key={cls.id}>
                  <td>{cls.id}</td>
                  <td>{cls.name}</td>
                  <td>{cls.Course?.name || 'N/A'}</td>
                  <td>{cls.Lecturer?.username || 'N/A'}</td>
                  <td>{new Date(cls.createdAt).toLocaleString()}</td>
                  <td>{new Date(cls.updatedAt).toLocaleString()}</td>
                  <td>
                    <FaEdit className="action-icon" onClick={() => openModal('class', cls, true)} />
                    <FaTrash className="action-icon" onClick={() => deleteItem('classes', cls.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pl-page">
      <div className="view-selector">
        <button onClick={() => setView('faculties')}>Faculties</button>
        <button onClick={() => setView('courses')}>Courses</button>
        <button onClick={() => setView('classes')}>Classes</button>
        <button onClick={() => setView('reports')}>Reports</button>
      </div>
      <div className="table-container">{renderTable()}</div>

      {/* -------------------- Modals -------------------- */}
      {showFacultyModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? 'Edit Faculty' : 'Add Faculty'}</h3>
            <input
              type="text"
              placeholder="Faculty Name"
              value={modalData.name || ''}
              onChange={e => setModalData({ ...modalData, name: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={() => saveFaculty(modalData.id)}>Save</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showCourseModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? 'Edit Course' : 'Add Course'}</h3>
            <input
              type="text"
              placeholder="Course Name"
              value={modalData.name || ''}
              onChange={e => setModalData({ ...modalData, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Course Code"
              value={modalData.code || ''}
              onChange={e => setModalData({ ...modalData, code: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              value={modalData.description || ''}
              onChange={e => setModalData({ ...modalData, description: e.target.value })}
            />
            <select
              value={modalData.facultyId || ''}
              onChange={e => setModalData({ ...modalData, facultyId: e.target.value })}
            >
              <option value="">Select Faculty</option>
              {faculties.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <select
              value={modalData.programLeaderId || ''}
              onChange={e => setModalData({ ...modalData, programLeaderId: e.target.value })}
            >
              <option value="">Select Program Leader</option>
              {users.filter(u => u.role === 'program_leader').map(u => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
            <select
              value={modalData.principalLecturerId || ''}
              onChange={e => setModalData({ ...modalData, principalLecturerId: e.target.value })}
            >
              <option value="">Select Principal Lecturer</option>
              {users.filter(u => u.role === 'principal_lecturer').map(u => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
            <div className="modal-actions">
              <button onClick={() => saveCourse(modalData.id)}>Save</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showClassModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? 'Edit Class' : 'Add Class'}</h3>
            <input
              type="text"
              placeholder="Class Name"
              value={modalData.name || ''}
              onChange={e => setModalData({ ...modalData, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Year"
              value={modalData.year || ''}
              onChange={e => setModalData({ ...modalData, year: e.target.value })}
            />
            <select
              value={modalData.semester || ''}
              onChange={e => setModalData({ ...modalData, semester: e.target.value })}
            >
              <option value="">Select Semester</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
            <input
              type="text"
              placeholder="Venue"
              value={modalData.venue || ''}
              onChange={e => setModalData({ ...modalData, venue: e.target.value })}
            />
            <input
              type="text"
              placeholder="Scheduled Time"
              value={modalData.scheduledTime || ''}
              onChange={e => setModalData({ ...modalData, scheduledTime: e.target.value })}
            />
            <input
              type="number"
              placeholder="Total Students"
              value={modalData.totalRegisteredStudents || 0}
              readOnly
            />
            <select
              value={modalData.courseId || ''}
              onChange={e => setModalData({ ...modalData, courseId: e.target.value })}
            >
              <option value="">Select Course</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={modalData.lecturerId || ''}
              onChange={e => setModalData({ ...modalData, lecturerId: e.target.value })}
            >
              <option value="">Select Lecturer</option>
              {users.filter(u => u.role === 'lecturer').map(u => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
            <div className="modal-actions">
              <button onClick={() => saveClass(modalData.id)}>Save</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramLeader;
