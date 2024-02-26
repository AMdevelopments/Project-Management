// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.scss';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        <li className="sidebar-item">
          <Link to="/">Home</Link> {/* Add this line */}
        </li>
        <li className="sidebar-item">
          <Link to="/projects">Projects</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/issues">Issues</Link>
        </li>
        {/* Add other sidebar items as needed */}
      </ul>
    </div>
  );
};

export default Sidebar;







