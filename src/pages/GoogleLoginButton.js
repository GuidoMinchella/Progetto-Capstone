import React from 'react';

function GoogleLoginButton() {
  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`;
  };

  return (
    <button onClick={handleLogin}>
      Accedi con Google
    </button>
  );
}

export default GoogleLoginButton;
