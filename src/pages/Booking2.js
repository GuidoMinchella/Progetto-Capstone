import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Booking2 = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameError, setNameError] = useState('');
  const [cardNumberError, setCardNumberError] = useState('');

  const handleNextPage = (e) => {
    e.preventDefault();
    let isValid = true;
    setNameError('');
    setCardNumberError('');

    if (!cardName.match(/^[A-Za-z]+ [A-Za-z]+$/)) {
      setNameError('Il nome e il cognome sono obbligatori e devono essere validi');
      isValid = false;
    }

    if (!cardNumber.match(/^\d{8,}$/)) {
      setCardNumberError('Il numero della carta deve contenere almeno 8 numeri');
      isValid = false;
    }

    if (isValid) {
      navigate('/booking3', { state: { ...state, cardName, cardNumber, expiryDate, cvv } });
    }
  };

  const handlePreviousPage = () => {
    navigate('/booking1', { state });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Dettagli di pagamento</h1>
      <form>
        <div className="form-group">
          <label>Nome sulla carta</label>
          <input 
            type="text" 
            className="form-control"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            required
            placeholder="Nome e Cognome"
          />
          {nameError && <div className="text-danger">{nameError}</div>}
        </div>

        <div className="form-group">
          <label>Numero della carta</label>
          <input 
            type="text" 
            className="form-control"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
            placeholder="Numero della carta"
          />
          {cardNumberError && <div className="text-danger">{cardNumberError}</div>}
        </div>

        <div className="form-group">
          <label>Data di scadenza</label>
          <input 
            type="month" 
            className="form-control"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
            placeholder="MM/YY"
          />
        </div>

        <div className="form-group">
          <label>CVV</label>
          <input 
            type="text" 
            className="form-control"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            required
            placeholder="CVV"
          />
        </div>

        <button className="btn btn-success mt-3" onClick={handleNextPage}>Conferma</button>
        <button className="btn btn-danger mt-3" onClick={handlePreviousPage}>Indietro</button>
      </form>
    </div>
  );
};

export default Booking2;
