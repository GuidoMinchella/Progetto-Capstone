import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';
import AuthSuccess from './AuthSuccess';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GoogleLoginButton />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/dashboard" element={<div>Benvenuto nella dashboard</div>} />
      </Routes>
    </Router>
  );
}

export default App;
