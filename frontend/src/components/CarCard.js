import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CarCard = ({ car, onBook }) => {
  return (
    <div className="card shadow-sm h-100" style={{ width: '100%', maxWidth: '18rem', margin: 'auto' }}>
      {/* Immagine */}
      {car.immagine && (
        <img 
          src={car.immagine} 
          className="card-img-top" 
          alt={`${car.marca} ${car.modello}`} 
          style={{ height: '180px', objectFit: 'cover' }}
        />
      )}

      {/* Corpo card */}
      <div className="card-body d-flex flex-column justify-content-between">
        <h5 className="card-title">{car.marca} {car.modello}</h5>
        
        <ul className="list-unstyled mb-3">
          <li><strong>Anno:</strong> {car.anno}</li>
          <li><strong>Tipologia:</strong> {car.tipologia}</li>
        </ul>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="badge bg-success p-2">
            {car.prezzoGiornaliero}€/giorno
          </span>
        </div>

        {/* Bottone Prenota Ora */}
        <button
          className="btn btn-primary w-100 mt-auto"
          onClick={() => onBook(car)}
        >
          Prenota ora
        </button>
      </div>
    </div>
  );
};

export default CarCard;
