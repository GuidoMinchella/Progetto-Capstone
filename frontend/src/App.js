import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LoginRegister from './pages/LoginRegister';
import CarList from './pages/CarList';
import Booking1 from './pages/Booking1';
import Booking2 from './pages/Booking2';
import Booking3 from './pages/Booking3';
import Register from './pages/Register';
import GoogleSuccess from './pages/GoogleSuccess';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound'; // <-- aggiunto
import PrivateRoute from './components/PrivateRoute';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Google OAuth

const App = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <Navbar />
        <div className="container mt-5">
          <Routes>
            {/* Rotte pubbliche */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/loginregister" element={<LoginRegister />} />
            <Route path="/google-success" element={<GoogleSuccess />} />

            {/* Rotte private */}
            <Route element={<PrivateRoute />}>
              <Route path="/carlist" element={<CarList />} />
              <Route path="/booking1" element={<Booking1 />} />
              <Route path="/booking2" element={<Booking2 />} />
              <Route path="/booking3" element={<Booking3 />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Rotta 404 - ultima */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
