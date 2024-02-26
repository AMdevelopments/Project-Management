// Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.scss';

const Navbar = () => {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleLogoutClick = () => {
    localStorage.removeItem('user_id');
    localStorage.setItem('isLoggedIn', 'false');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-title">Project Management App</Link>
      <div className="navbar-links">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <>
            <Link to={`/profile/${localStorage.getItem('user_id')}`} className="nav-link">Profile</Link>
            <button onClick={handleLogoutClick} className="nav-link">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;




 






