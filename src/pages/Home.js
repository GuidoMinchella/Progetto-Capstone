import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rentalType, setRentalType] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setError('Le date di noleggio sono obbligatorie');
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (startDate <= today) {
      setError('La data di partenza deve essere successiva alla data odierna');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError('La data di partenza deve essere precedente alla data di riconsegna');
      return;
    }

    if (!rentalType) {
      setError('Seleziona una tipologia di noleggio');
      return;
    }

    localStorage.setItem('startDate', startDate);
    localStorage.setItem('endDate', endDate);
    localStorage.setItem('rentalType', rentalType);

    navigate('/carlist');
    setError('');
  };

  return (
    <div>
      <div className="rental-box">
        <div className="booking-form">
          <h2>Prenota la tua auto</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Giorni di noleggio</label>
              <div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <button
                type="button"
                className="coupon-btn"
                onClick={() => setShowCouponInput(!showCouponInput)}
              >
                Ho un coupon
              </button>
            </div>

            {showCouponInput && (
              <div className="form-group">
                <input
                  type="text"
                  className="coupon-input"
                  placeholder="Inserisci il codice del coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label>Tipologia di Noleggio</label>
              <select
                value={rentalType}
                onChange={(e) => setRentalType(e.target.value)}
                required
              >
                <option value="">Seleziona tipologia</option>
                <option value="svago">Svago</option>
                <option value="lavoro">Lavoro</option>
                <option value="altro">Altro</option>
              </select>
            </div>

            <button type="submit">Prenota</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
