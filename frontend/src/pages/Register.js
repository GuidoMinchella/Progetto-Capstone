import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/loginRegister.css';

const Register = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dataNascita, setDataNascita] = useState('');
  const [documentoIdentita, setDocumentoIdentita] = useState(null);
  const [patente, setPatente] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [ setIsRedirectEnabled] = useState(false);  // Flag for redirect

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!nome || !cognome || !email || !password || !dataNascita || !documentoIdentita || !patente) {
      setError('Tutti i campi sono obbligatori');
      return;
    }

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('cognome', cognome);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('dataNascita', dataNascita);
    formData.append('documentoIdentita', documentoIdentita);
    formData.append('patente', patente);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.message) {
        setError(data.message); // Show error message
      } else {
        // If registration is successful, display the success message
        setSuccessMessage('Registrazione avvenuta con successo!');
        setIsRedirectEnabled(true);  // Enable the redirect button
      }
    } catch (err) {
      setError('Errore nella registrazione, riprova!');
    }
  };

  const handleRedirectToHome = () => {
    navigate('/'); // Redirect to home page
  };

  return (
    <div className="login-register-container">
      <h2>Registrati</h2>

      <div className="login-form">
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Cognome</label>
            <input
              type="text"
              value={cognome}
              onChange={(e) => setCognome(e.target.value)}
              required
            />
          </div>
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
          <div className="form-group">
            <label>Data di Nascita</label>
            <input
              type="date"
              value={dataNascita}
              onChange={(e) => setDataNascita(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Documento di Identità</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setDocumentoIdentita(e.target.files[0])}
              required
            />
          </div>
          <div className="form-group">
            <label>Patente</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPatente(e.target.files[0])}
              required
            />
          </div>
          <button type="submit">Registrati</button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div>
          <button
          style={{ backgroundColor: 'red', color: 'white', padding: '10px', width: "200px", fontSize: '14px', border: 'none', borderRadius: '5px' }} 
          onClick={handleRedirectToHome}>Torna alla Home</button>
      </div>
      

      <p>
        Hai già un account? <a href="/loginregister">Accedi</a>
      </p>
    </div>
  );
};

export default Register;
