// backend/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const jwt = require('jsonwebtoken');

// Middleware per autenticazione
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// 📌 POST /api/bookings ➔ Creazione nuova prenotazione
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { carId, carModel, startDate, endDate, rentalType, price, paymentInfo } = req.body;

    const newBooking = new Booking({
      userId: req.user.id,
      carId,
      carModel,
      startDate,
      endDate,
      rentalType,
      price,
      paymentInfo
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    console.error('Errore durante la creazione della prenotazione:', err);
    res.status(500).json({ message: 'Errore nel salvataggio della prenotazione.' });
  }
});

// 📌 GET /api/bookings/my-bookings ➔ Recupero prenotazioni utente
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    res.json(bookings);
  } catch (err) {
    console.error('Errore durante il recupero delle prenotazioni:', err);
    res.status(500).json({ message: 'Errore nel recupero delle prenotazioni.' });
  }
});

// 📌 PUT /api/bookings/update/:id ➔ Modifica una prenotazione
router.put('/update/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Prenotazione non trovata' });
    }

    // Verifica che l'utente proprietario sia quello loggato
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorizzato' });
    }

    const { startDate, endDate, rentalType } = req.body;

    booking.startDate = startDate || booking.startDate;
    booking.endDate = endDate || booking.endDate;
    booking.rentalType = rentalType || booking.rentalType;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);

  } catch (err) {
    console.error('Errore aggiornamento prenotazione:', err);
    res.status(500).json({ message: 'Errore aggiornamento prenotazione.' });
  }
});

// 📌 DELETE /api/bookings/delete/:id ➔ Elimina una prenotazione
router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Prenotazione non trovata' });
    }

    // Verifica che l'utente proprietario sia quello loggato
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorizzato' });
    }

    await booking.deleteOne();
    res.json({ message: 'Prenotazione eliminata con successo' });

  } catch (err) {
    console.error('Errore eliminazione prenotazione:', err);
    res.status(500).json({ message: 'Errore eliminazione prenotazione.' });
  }
});

module.exports = router;
