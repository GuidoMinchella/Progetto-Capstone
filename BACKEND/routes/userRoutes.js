const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { protect } = require('../middleware/authMiddleware');

// ✅ Recupera dati dell'utente loggato
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    res.json(user);
  } catch (err) {
    console.error('Errore recupero dati utente:', err);
    res.status(500).json({ message: 'Errore del server' });
  }
});

// ✅ Modifica dati utente
router.put('/update', protect, async (req, res) => {
  try {
    const { nome, cognome, email } = req.body;
    const user = await User.findById(req.user);

    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    user.nome = nome || user.nome;
    user.cognome = cognome || user.cognome;
    user.email = email || user.email;

    await user.save();
    res.json({ nome: user.nome, cognome: user.cognome, email: user.email });
  } catch (err) {
    console.error('Errore aggiornamento utente:', err);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento dei dati utente' });
  }
});

// ✅ Elimina account utente
router.delete('/delete', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user);
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    res.json({ message: 'Account eliminato con successo' });
  } catch (err) {
    console.error('Errore eliminazione account:', err);
    res.status(500).json({ message: 'Errore del server durante l\'eliminazione' });
  }
});

module.exports = router;
