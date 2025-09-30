import React, { useEffect, useState } from 'react';
import './admin.css';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState(''); // for role filtering
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const roles = ['lecture', 'program_leader', 'admin', 'principal_lecture', 'student'];

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Users categorized by role
  const usersByRole = roles.reduce((acc, role) => {
    acc[role] = users.filter(u => u.role === role);
    return acc;
  }, {});

  // Modal handlers
  const openModal = (user = {}, editing = false) => {
    setModalData(user);
    setIsEditing(editing);
    setShowModal(true);
  };

  const closeModal = () => {
    setModalData({});
    setIsEditing(false);
    setShowModal(false);
  };

  // Save user
  const saveUser = async () => {
    const { id, username, email, password, passwordConfirm, role } = modalData;
    if (!username || !email || (!isEditing && (!password || !passwordConfirm)) || !role) {
      return alert('Fill in all required fields');
    }

    const url = isEditing ? `http://localhost:3000/api/users/${id}` : 'http://localhost:3000/api/users';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modalData),
      });
      const data = await res.json();
      if (data.status === 'success') {
        fetchUsers();
        closeModal();
      }
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.status === 'success') fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // Filtered users for table
  const displayedUsers = selectedRole ? usersByRole[selectedRole] : users;

  return (
    <div className="admin-page">

      <div className="button-group">
        <button onClick={() => openModal()}>Add User</button>

        {roles.map(role => (
          <button
            key={role}
            className={selectedRole === role ? 'selected' : ''}
            onClick={() => setSelectedRole(selectedRole === role ? '' : role)}
          >
            {role.replace('_', ' ').toUpperCase()} ({usersByRole[role].length})
          </button>
        ))}
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
                <td>{new Date(u.updatedAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => openModal(u, true)}>Edit</button>
                  <button onClick={() => deleteUser(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {displayedUsers.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  No users in this category
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? 'Edit User' : 'Add User'}</h3>
            <input
              type="text"
              placeholder="Username"
              value={modalData.username || ''}
              onChange={e => setModalData({ ...modalData, username: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={modalData.email || ''}
              onChange={e => setModalData({ ...modalData, email: e.target.value })}
            />
            {!isEditing && (
              <>
                <input
                  type="password"
                  placeholder="Password"
                  value={modalData.password || ''}
                  onChange={e => setModalData({ ...modalData, password: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={modalData.passwordConfirm || ''}
                  onChange={e => setModalData({ ...modalData, passwordConfirm: e.target.value })}
                />
              </>
            )}
            <select
              value={modalData.role || ''}
              onChange={e => setModalData({ ...modalData, role: e.target.value })}
            >
              <option value="">Select Role</option>
              {roles.map(role => (
                <option key={role} value={role}>
                  {role.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={saveUser}>Save</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
