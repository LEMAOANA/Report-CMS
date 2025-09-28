import React from 'react';
import './leader.css';

const ProgramLeader = () => {
  const handleAction = (action) => {
    alert(`Feature clicked: ${action}`);
    // Later: navigate to subpages or open modals
  };

  return (
    <div className="pl-page">
      <h2>Program Leader (PL)</h2>
          <div className="pl-actions">
        <div className="pl-card" onClick={() => handleAction('Courses')}>
          Courses
          <p className="card-desc">Add courses & assign lecture modules</p>
        </div>

        <div className="pl-card" onClick={() => handleAction('Reports')}>
          Reports
          <p className="card-desc">View reports from PRL</p>
        </div>

        <div className="pl-card" onClick={() => handleAction('Monitoring')}>
          Monitoring
          <p className="card-desc">Monitor classes</p>
        </div>

        <div className="pl-card" onClick={() => handleAction('Classes')}>
          Classes
          <p className="card-desc">View/manage classes</p>
        </div>

        <div className="pl-card" onClick={() => handleAction('Lectures')}>
          Lectures
          <p className="card-desc">Manage lectures</p>
        </div>

        <div className="pl-card" onClick={() => handleAction('Rating')}>
          Rating
          <p className="card-desc">Rate classes</p>
        </div>
      </div>
    </div>
  );
};

export default ProgramLeader;
