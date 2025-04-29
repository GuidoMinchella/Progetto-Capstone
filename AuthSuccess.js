import React, { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { useNavigate, useLocation } from 'react-router-dom';

function AuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (token) {
      const user = jwtDecode(token);
      localStorage.setItem('token', token);
      console.log('Utente autenticato:', user);
      navigate('/dashboard'); // O dove vuoi portarlo
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  return <div>Autenticazione in corso...</div>;
}

export default AuthSuccess;
