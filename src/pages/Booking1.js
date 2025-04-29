import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CarCard from '../components/CarCard';  // Assicurati di importare CarCard

const Booking1 = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <h2>Errore: Nessuna auto selezionata per la prenotazione</h2>;
  }

  const { car, startDate, endDate, rentalType } = state;

  // Calcolo dei giorni di noleggio
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end - start;
  const days = timeDiff / (1000 * 3600 * 24);
  const totalPrice = car.prezzoGiornaliero * days;

  const handleNextPage = () => {
    navigate('/booking2', { state: { ...state } });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Dettagli Prenotazione</h1>
      <div className="booking-details mb-4">
        <p><strong>Auto:</strong> {car.marca} {car.modello}</p>
        <p><strong>Giorni di noleggio:</strong> {startDate} - {endDate}</p>
        <p><strong>Tipo di noleggio:</strong> {rentalType}</p>
        <h3>Auto Selezionata:</h3>
        <div className="card shadow-sm" style={{ maxWidth: '400px', margin: 'auto' }}>
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
            <p className="card-text"><strong>Anno:</strong> {car.anno}</p>
            <p className="card-text"><strong>Tipologia:</strong> {car.tipologia}</p>
            <span className="badge bg-success">{car.prezzoGiornaliero}€/giorno</span>
          </div>
        </div>

        <h3>Totale del prezzo:</h3>
        <p><strong>Totale per {days} giorni:</strong> €{totalPrice}</p>

        <button
          className="btn btn-success mr-2"
          style={{ width: '250px' }}
          onClick={handleNextPage}
        >
          Conferma
        </button>

      </div>
    </div>
  );
};

export default Booking1;
