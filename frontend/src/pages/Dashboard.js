import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ nome: '', cognome: '', email: '' });
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [bookingFormData, setBookingFormData] = useState({ startDate: '', endDate: '', rentalType: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData && token) {
        setUser(userData);
        try {
          const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          const data = await response.json();
          setBookings(data);
        } catch (err) {
          console.error('Errore nel recupero delle prenotazioni:', err);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleEdit = () => {
    setEditing(true);
    setFormData({
      nome: user?.nome || '',
      cognome: user?.cognome || '',
      email: user?.email || '',
    });
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Sei sicuro di volerci abbandonare?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/user/delete', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      alert('Account eliminato correttamente');
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error('Errore nella cancellazione account:', err);
      alert('Errore durante l\'eliminazione.');
    }
  };

  const handleConfirmEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Dati aggiornati con successo!');
        const updatedUser = await response.json();
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditing(false);
        window.location.reload();
      } else {
        const errData = await response.json();
        alert('Errore aggiornamento: ' + errData.message);
      }
    } catch (err) {
      console.error('Errore aggiornamento utente:', err);
    }
  };

  const handleBookingEdit = (booking) => {
    setEditingBookingId(booking._id);
    setBookingFormData({
      startDate: booking.startDate.slice(0,10),
      endDate: booking.endDate.slice(0,10),
      rentalType: booking.rentalType,
    });
  };

  const handleConfirmBookingEdit = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/bookings/update/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingFormData),
      });

      if (response.ok) {
        alert('Prenotazione aggiornata!');
        window.location.reload();
      } else {
        alert('Errore aggiornamento prenotazione');
      }
    } catch (err) {
      console.error('Errore aggiornamento prenotazione:', err);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm('Sei sicuro di voler abbandonare la tua auto?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/bookings/delete/${bookingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        alert('Prenotazione eliminata');
        window.location.reload();
      } else {
        alert('Errore eliminazione prenotazione');
      }
    } catch (err) {
      console.error('Errore eliminazione prenotazione:', err);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleBookingFormChange = (e) => {
    setBookingFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };

  if (!user) return <h2>Caricamento dati utente...</h2>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Benvenuto, {user.nome}!</h1>
      <div className="row">
        {/* Colonna sinistra */}
        <div className="col-md-4 mb-4">
          <div className="card p-3 shadow-sm">
            <h4>Dati utente</h4>
            {editing ? (
              <div>
                <input type="text" name="nome" className="form-control mb-2" value={formData.nome} onChange={handleChange} placeholder="Nome" />
                <input type="text" name="cognome" className="form-control mb-2" value={formData.cognome} onChange={handleChange} placeholder="Cognome" />
                <input type="email" name="email" className="form-control mb-2" value={formData.email} onChange={handleChange} placeholder="Email" />
                <button className="btn btn-success me-2 mb-2" onClick={handleConfirmEdit}>Conferma modifiche</button>
                <button className="btn btn-secondary mb-2" onClick={() => setEditing(false)}>Annulla</button>
              </div>
            ) : (
              <ul className="list-unstyled">
                <li><strong>Nome:</strong> {user.nome}</li>
                <li><strong>Cognome:</strong> {user.cognome}</li>
                <li><strong>Email:</strong> {user.email}</li>
              </ul>
            )}
            {!editing && (
              <div className="mt-3 d-flex gap-2">
                <button className="btn btn-primary" onClick={handleEdit}>Modifica account</button>
                <button className="btn btn-danger" onClick={handleDeleteAccount}>Elimina account</button>
              </div>
            )}
            <hr />
            <h5>Progressi</h5>
            <ul className="list-unstyled">
              <li>✅ Registrazione completata</li>
              <li>✅ Documenti caricati</li>
              <li>✅ Prenotazioni: {bookings.length}</li>
            </ul>
          </div>
        </div>

        {/* Colonna destra */}
        <div className="col-md-8">
          <h4>Storico prenotazioni</h4>
          {bookings.length > 0 ? (
            bookings.map(booking => (
              <div key={booking._id} className="card mb-3 shadow-sm p-3">
                {editingBookingId === booking._id ? (
                  <>
                    <input type="date" name="startDate" className="form-control mb-2" value={bookingFormData.startDate} onChange={handleBookingFormChange} />
                    <input type="date" name="endDate" className="form-control mb-2" value={bookingFormData.endDate} onChange={handleBookingFormChange} />
                    <select name="rentalType" className="form-control mb-2" value={bookingFormData.rentalType} onChange={handleBookingFormChange}>
                      <option value="giornaliero">Giornaliero</option>
                      <option value="settimanale">Settimanale</option>
                      <option value="mensile">Mensile</option>
                    </select>
                    <button className="btn btn-success me-2" onClick={() => handleConfirmBookingEdit(booking._id)}>Conferma modifiche</button>
                    <button className="btn btn-secondary" onClick={() => setEditingBookingId(null)}>Annulla</button>
                  </>
                ) : (
                  <>
                    <h5>{booking.carModel}</h5>
                    <p><strong>Periodo:</strong> {formatDate(booking.startDate)} → {formatDate(booking.endDate)}</p>
                    <p><strong>Tipo di noleggio:</strong> {booking.rentalType}</p>
                    <p><strong>Prezzo:</strong> €{booking.price}</p>
                    <p className="text-muted">Prenotazione del {formatDate(booking.createdAt)}</p>
                    <div className="d-flex gap-2">
                      <button className="btn btn-primary" onClick={() => handleBookingEdit(booking)}>Modifica prenotazione</button>
                      <button className="btn btn-danger" onClick={() => handleDeleteBooking(booking._id)}>Elimina prenotazione</button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>Nessuna prenotazione trovata.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
