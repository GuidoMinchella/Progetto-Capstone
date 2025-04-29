import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem('token'); // Prendi il token dal localStorage

  // Se non esiste un token, reindirizza l'utente alla pagina di login
  if (!token) {
    return <Redirect to="/login" />;
  }

  // Altrimenti, permetti l'accesso alla rotta protetta
  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default ProtectedRoute;
