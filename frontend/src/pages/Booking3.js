import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Booking3 = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <h2>Errore: Nessuna prenotazione da visualizzare</h2>;
  }

  const { car, startDate, endDate, rentalType, cardName, cardNumber, expiryDate } = state;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end - start;
  const days = timeDiff / (1000 * 3600 * 24);
  const totalPrice = car.prezzoGiornaliero * days;

  const lastFourDigits = cardNumber ? cardNumber.slice(-4) : '****';

  const handleConfirmBooking = async () => {
    const confirm = window.confirm('Sei sicuro di voler confermare la tua prenotazione?');
    if (!confirm) {
      return; // Se clicca su Annulla, resta su booking3
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Effettua il login per confermare la prenotazione');
        navigate('/loginregister');
        return;
      }

      const bookingData = {
        carId: car._id,
        carModel: `${car.marca} ${car.modello}`,
        startDate,
        endDate,
        rentalType,
        price: totalPrice,
        paymentInfo: {
          cardName,
          lastFourDigits,
          expiryDate,
        },
      };

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        alert('Prenotazione confermata!');
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        alert('Errore nella prenotazione: ' + errorData.message);
      }
    } catch (err) {
      console.error('Errore durante la prenotazione:', err);
      alert('Errore di connessione, riprova più tardi.');
    }
  };

  const handlePreviousPage = () => {
    navigate('/booking2', { state });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Riepilogo della Prenotazione</h1>
      
      <div className="row">
        {/* Colonna sinistra - Dati prenotazione */}
        <div className="col-md-8">
          <p><strong>Auto:</strong> {car.marca} {car.modello}</p>
          <p><strong>Giorni di noleggio:</strong> {startDate} - {endDate}</p>
          <p><strong>Tipo di noleggio:</strong> {rentalType}</p>
          <p><strong>Totale da pagare:</strong> €{totalPrice}</p>

          <h3 className="mt-4">Dati della carta di credito</h3>
          <p><strong>Nome sulla carta:</strong> {cardName}</p>
          <p><strong>Numero della carta:</strong> **** **** **** {lastFourDigits}</p>
          <p><strong>Data di scadenza:</strong> {expiryDate}</p>

          {/* Pulsanti sulla stessa riga */}
          <div className="d-flex mt-4">
            <button 
              className="btn btn-success me-3"
              style={{ width: '150px' }}
              onClick={handleConfirmBooking}
            >
              Conferma
            </button>

            <button 
              className="btn btn-danger"
              style={{ width: '150px' }}
              onClick={handlePreviousPage}
            >
              Indietro
            </button>
          </div>
        </div>

        {/* Colonna destra - Card auto */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            {car.immagine && (
              <img 
                src={car.immagine} 
                className="card-img-top" 
                alt={`${car.marca} ${car.modello}`} 
                style={{ height: '280px', objectFit: 'cover' }}
              />
            )}
            <div className="card-body text-center">
              <h5 className="card-title">{car.marca} {car.modello}</h5>
              <span className="badge bg-success p-2">
                {car.prezzoGiornaliero}€/giorno
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Booking3;
