import React, { useEffect, useState } from 'react';
import { FaPlusCircle, FaEdit, FaTrash } from 'react-icons/fa';
import './leader.css';

const ProgramLeader = () => {
  // -------------------- Data States --------------------
  const [faculties, setFaculties] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);

  // -------------------- View State --------------------
  const [view, setView] = useState(''); // 'faculties', 'courses', 'classes'

  // -------------------- Modal States --------------------
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // -------------------- Backend Base URL --------------------
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

  useEffect(() => {
    fetchFaculties();
    fetchUsers();
    fetchCourses();
    fetchClasses();
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
    const { name, year, semester, venue, scheduledTime, courseId, lecturerId } = modalData;
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

  // -------------------- Render Table --------------------
  const renderTable = () => {
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
                  <FaPlusCircle
                    className="add-icon"
                    title="Add Faculty"
                    onClick={() => openModal('faculty')}
                  />
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
                <th>
                  <FaPlusCircle
                    className="add-icon"
                    title="Add Course"
                    onClick={() => openModal('course')}
                  />
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
                <th>
                  <FaPlusCircle
                    className="add-icon"
                    title="Add Class"
                    onClick={() => openModal('class')}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {classes.map(cls => (
                <tr key={cls.id}>
                  <td>{cls.id}</td>
                  <td>{cls.name}</td>
                  <td>{cls.Course?.name || 'N/A'}</td>
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
              placeholder="Scheduled Time (e.g., 08:00 - 10:00)"
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
