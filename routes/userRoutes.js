const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Middleware per protezione con token
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

// 📌 GET /api/user/me ➔ Restituisce dati utente autenticato
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('nome cognome email');
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    res.json(user);
  } catch (err) {
    console.error('Errore nel recupero dati utente:', err);
    res.status(500).json({ message: 'Errore del server' });
  }
});

module.exports = router;

