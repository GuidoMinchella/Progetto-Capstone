
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container text-center mt-5">
      <h1>404</h1>
      <h2>Pagina non trovata</h2>
      <p>La pagina che stai cercando non esiste o è stata spostata.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Torna alla Home
      </Link>
    </div>
  );
};

export default NotFound;
