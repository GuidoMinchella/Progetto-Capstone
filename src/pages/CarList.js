import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarCard from '../components/CarCard';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auto');
        if (!response.ok) {
          throw new Error('Errore nel recupero delle auto');
        }
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error('Errore nel recupero delle auto:', error);
      }
    };

    fetchCars();
  }, []);

  const handleBooking = (car) => {
    const startDate = localStorage.getItem('startDate');
    const endDate = localStorage.getItem('endDate');
    const rentalType = localStorage.getItem('rentalType');

    navigate('/booking1', { state: { car, startDate, endDate, rentalType } });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Seleziona la tua auto</h1>
      <div className="row">
        {cars.length > 0 ? (
          cars.map((car) => (
            <div className="col-md-4 d-flex align-items-stretch mb-4" key={car._id}>
              <CarCard car={car} onBook={handleBooking} />
            </div>
          ))
        ) : (
          <p>Caricamento auto in corso...</p>
        )}
      </div>
    </div>
  );
};

export default CarList;
