import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async (token) => {
      try {
        const response = await fetch('http://localhost:5000/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = await response.json();
        localStorage.setItem('userData', JSON.stringify(userData));
      } catch (err) {
        console.error('Errore nel recupero dati utente dopo login Google:', err);
      }
    };

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
    } else {
      navigate('/loginregister');
    }
  }, [location, navigate]);

  return null; // Non mostriamo nulla
};

export default GoogleSuccess;
