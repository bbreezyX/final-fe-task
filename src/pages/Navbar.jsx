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
} from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

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

          <button
            className="btn btn-outline-danger d-flex align-items-center"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
