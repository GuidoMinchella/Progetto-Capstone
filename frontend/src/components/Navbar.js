import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      setUser(userData || null);
      setLoading(false);
    };
    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/');
    window.location.reload();
  };

  const handleDashboard = () => navigate('/dashboard');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="./assets/logo4-removebg-preview.png" alt="Rental Car Italy" style={{ width: '130px',marginRight: '30px' }} />
          Home
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <button
                className="nav-link btn btn-link text-white"
                id="navbarDropdown"
                data-bs-toggle="dropdown"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                Account {menuOpen ? '►' : '▼'}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                {!user ? (
                  <li>
                    <Link className="dropdown-item" to="/loginregister">Accedi</Link>
                  </li>
                ) : (
                  <>
                    <li><button className="dropdown-item" onClick={handleDashboard}>Dashboard</button></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
