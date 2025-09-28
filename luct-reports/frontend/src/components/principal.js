import React from 'react';
import './principal.css';

const Principal = () => {
  const handleAction = (action) => {
    alert(`Feature clicked: ${action}`);
    // Here you can navigate to subpages or open modals
  };

  return (
    <div className="prl-page">
      <h2>Principal Lecturer (PRL)</h2>
    

      <div className="prl-actions">
        <div className="prl-card" onClick={() => handleAction('Courses')}>
          Courses
          <p className="card-desc">View all courses & lectures under your stream</p>
        </div>

        <div className="prl-card" onClick={() => handleAction('Reports')}>
          Reports
          <p className="card-desc">View lecture reports & add feedback</p>
        </div>

        <div className="prl-card" onClick={() => handleAction('Monitoring')}>
          Monitoring
          <p className="card-desc">Monitor classes</p>
        </div>

        <div className="prl-card" onClick={() => handleAction('Rating')}>
          Rating
          <p className="card-desc">Rate classes</p>
        </div>

        <div className="prl-card" onClick={() => handleAction('Classes')}>
          Classes
          <p className="card-desc">View/manage classes</p>
        </div>
      </div>
    </div>
  );
};

export default Principal;
