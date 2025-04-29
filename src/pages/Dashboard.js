import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const token = localStorage.getItem('token');
    if (userData && token) {
      setUser(userData);
      fetch('http://localhost:5000/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => setBookings(data))
        .catch(err => console.error('Errore nel recupero delle prenotazioni:', err));
    }
  }, []);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };

  if (!user) {
    return <h2>Caricamento dati utente...</h2>;
  }

  return (
    <div className="container mt-5">
      <h1>Benvenuto nella tua Dashboard, {user.nome}!</h1>

      <h2>I tuoi dati:</h2>
      <ul>
        <li><strong>Nome:</strong> {user.nome}</li>
        <li><strong>Cognome:</strong> {user.cognome}</li>
        <li><strong>Email:</strong> {user.email}</li>
      </ul>

      <h2 className="mt-4">Storico delle tue prenotazioni</h2>

      {bookings.length > 0 ? (
        <div className="row">
          {bookings.map(booking => (
            <div key={booking._id} className="col-md-6 mb-4">
              <div className="card shadow-sm p-3">
                <h5 className="card-title">{booking.carModel}</h5>
                <p className="card-text">
                  <strong>Periodo:</strong> {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                </p>
                <p className="card-text">
                  <strong>Tipo di noleggio:</strong> {booking.rentalType}
                </p>
                <p className="card-text">
                  <strong>Prezzo totale:</strong> €{booking.price}
                </p>
                <p className="card-text text-muted">
                  Prenotazione effettuata il {formatDate(booking.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Non hai ancora effettuato prenotazioni.</p>
      )}
    </div>
  );
};

export default Dashboard;
