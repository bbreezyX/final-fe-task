import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faTasks,
  faPlus,
  faSignOutAlt,
  faBars,
  faTimes,
  faUser,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const nama = localStorage.getItem('nama');

    if (token && userId && username && nama) {
      setUserData({
        id: userId,
        username: username,
        nama: nama,
      });
    } else {
      navigate('/login');
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigate]);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest('.user-dropdown-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear all localStorage items
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('nama');
      navigate('/login');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (!userData) {
    return null;
  }

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
          <span className="brand-text">Task Manager</span>
        </Link>

        <button
          className={`navbar-toggler border-0 ${isMenuOpen ? 'collapsed' : ''}`}
          type="button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                to="/dashboard"
                onClick={closeMenu}
              >
                <FontAwesomeIcon icon={faHome} className="me-2" />
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/task') ? 'active' : ''}`}
                to="/task"
                onClick={closeMenu}
              >
                <FontAwesomeIcon icon={faTasks} className="me-2" />
                My Tasks
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/add-task') ? 'active' : ''}`}
                to="/add-task"
                onClick={closeMenu}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Task
              </Link>
            </li>
          </ul>

          <div className="user-dropdown-container position-relative">
            <button
              className="btn btn-light rounded-pill px-4 d-flex align-items-center"
              onClick={toggleDropdown}
            >
              <FontAwesomeIcon icon={faUser} className="me-2" />
              {userData.nama}
              <FontAwesomeIcon icon={faCaretDown} className="ms-2" />
            </button>

            {showDropdown && (
              <div
                className="dropdown-menu show position-absolute end-0 mt-2 py-2 shadow-sm"
                style={{
                  transform: 'none',
                  animation: 'none',
                }}
              >
                <div className="px-4 py-2 border-bottom">
                  <div className="small text-muted">ID: {userData.id}</div>
                  <div className="fw-bold">{userData.username}</div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="dropdown-item d-flex align-items-center px-4 py-2"
                  style={{ color: '#dc3545' }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
