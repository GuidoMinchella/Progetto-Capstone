import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../styles/loginRegister.css';

const LoginRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const userData = await response.json();
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (err) {
      console.error('Errore nel recupero dati utente:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email e password sono obbligatorie');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        await fetchUserData(data.token);
        navigate('/');
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        setError(data.message || 'Login fallito');
      }
    } catch (err) {
      console.error('Login fallito:', err);
      setError('Errore di connessione al server');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      fetchUserData(token)
        .then(() => {
          navigate('/');
          setTimeout(() => {
            window.location.reload();
          }, 300);
        })
        .catch(() => {
          navigate('/');
          setTimeout(() => {
            window.location.reload();
          }, 300);
        });
    }
  }, [location, navigate]);

  return (
    <div className="login-register-container">
      <h2>Login o Registrazione</h2>

      <div className="login-form">
        <h3>Login con Email e Password</h3>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">Login</button>
        </form>
      </div>

      <div className="divider">
        <hr />
        <p>Oppure accedi con:</p>
      </div>

      {/* Bottone Google migliorato */}
      <div className="d-grid gap-2">
        <button
          onClick={() => {
            window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`;
          }}
          className="btn btn-light border d-flex align-items-center justify-content-center"
          style={{ gap: '10px' }}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            style={{ width: '20px', height: '20px' }}
          />
          <span>Accedi con Google</span>
        </button>
      </div>

      {/* Registrazione link */}
      <div className="text-center mt-4">
        <p>Non sei ancora registrato? <Link to="/register">Registrati</Link></p>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default LoginRegister;
