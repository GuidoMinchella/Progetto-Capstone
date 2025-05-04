import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rentalType, setRentalType] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');
  const [cars, setCars] = useState([]);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/auto')
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => b.prezzoGiornaliero - a.prezzoGiornaliero);
        setCars(sorted.slice(0, 6));
      })
      .catch(err => console.error('Errore nel caricamento auto:', err));
  }, []);

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

  const scrollSlider = (direction) => {
    const scrollAmount = 300;
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <>
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

      <section className="featured-cars">
        <h2 className="section-title">Veicoli in Evidenza</h2>

        <button className="scroll-button left" onClick={() => scrollSlider('left')}>&#10094;</button>
        <div className="featured-scroll" ref={sliderRef}>
          {cars.map(car => (
            <div key={car._id} className="car-card">
              <img src={car.immagine} alt={car.modello} className="car-img" />
              <div className="car-info">
                <h3>{car.marca} {car.modello}</h3>
                <p>Prezzo: €{car.prezzoGiornaliero}/giorno</p>
              </div>
            </div>
          ))}
        </div>
        <button className="scroll-button right" onClick={() => scrollSlider('right')}>&#10095;</button>
      </section>

      <section className="benefits-section">
        <h2 className="section-title">I Nostri Vantaggi</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>Assicurazione Base Gratuita</h3>
            <p>Ogni noleggio include un'assicurazione base senza costi aggiuntivi.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <i className="fas fa-headset"></i>
            </div>
            <h3>Assistenza 24/7</h3>
            <p>Supporto clienti disponibile 24 ore su 24, 7 giorni su 7.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <i className="fas fa-car-side"></i>
            </div>
            <h3>Flotta Premium</h3>
            <p>Veicoli di lusso sempre nuovi e perfettamente mantenuti.</p>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2 className="section-title text-light">Cosa Dicono i Nostri Clienti</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">★★★★★ <span>5.0</span></div>
            <p>"Servizio impeccabile! Ho noleggiato una Ferrari per il weekend e l'esperienza è stata fantastica. Auto in condizioni perfette e personale molto professionale."</p>
            <h4>Marco B. - Milano</h4>
          </div>
          <div className="testimonial-card">
            <div className="stars">★★★★★ <span>5.0</span></div>
            <p>"Ho noleggiato una Lamborghini per il mio anniversario di matrimonio. Il servizio è stato eccellente e l'auto era spettacolare. Consigliatissimo!"</p>
            <h4>Giulia R. - Roma</h4>
          </div>
          <div className="testimonial-card">
            <div className="stars">★★★★½ <span>4.5</span></div>
            <p>"Ottima esperienza con Rental Car Italy. Procedura di noleggio semplice e veloce. L'auto era in perfette condizioni e il prezzo competitivo."</p>
            <h4>Alessandro M. - Firenze</h4>
          </div>
        </div>
      </section>

      <footer className="footer-section">
        <div className="footer-top">
          <div className="footer-column">
            <h3>Rental Car Italy</h3>
            <p>La tua esperienza di guida esclusiva in Italia con le migliori auto di lusso.</p>
          </div>
          <div className="footer-column">
            <h3>Link Utili</h3>
            <ul>
              <li>Chi Siamo</li>
              <li>Flotta Completa</li>
              <li>Termini e Condizioni</li>
              <li>Privacy Policy</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contatti</h3>
            <p>Via del Corso 123, 00186 Roma, Italia</p>
            <p>+39 06 1234 5678</p>
            <p>info@rentalcaritaly.com</p>
          </div>
        </div>
      </footer>


    </>
  );
};

export default Home;
