import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/dashboard">
          Task Manager
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-menu">
            <li className="navbar-item">
              <Link className="navbar-link" to="/dashboard">
                Home
              </Link>
            </li>
            <li className="navbar-item">
              <Link className="navbar-link" to="/task">
                My Tasks
              </Link>
            </li>
            <li className="navbar-item">
              <Link className="navbar-link" to="/add-task">
                Tambah Task
              </Link>
            </li>
          </ul>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
