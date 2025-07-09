import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/">🏠 Home</Link>

        {isLoggedIn && role === 'student' && (
          <>
            <Link to="/dashboard">📊 Dashboard</Link>
            <Link to="/upload">📁 Upload</Link>
            <Link to="/update-profile">🛠 Update Profile</Link>
          </>
        )}

        {isLoggedIn && role === 'tutor' && (
          <>
            <Link to="/tutor">📢 Notifications</Link>
            <Link to="/tutor/students">📋 Student List</Link>
          </>
        )}
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <button onClick={handleLogout}>🚪 Logout</button>
        ) : (
          <>
            <Link to="/">🔐 Login</Link>
            <Link to="/register">📝 Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
