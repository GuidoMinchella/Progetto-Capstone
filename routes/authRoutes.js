const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const uploadDocuments = require('../middleware/uploadDocuments');
const sendgrid = require('@sendgrid/mail');
const bcrypt = require('bcryptjs');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const sendConfirmationEmail = (email, nome) => {
  const msg = {
    to: email,
    from: 'noreply@capstone.com',
    subject: 'Conferma la tua registrazione',
    text: `Ciao ${nome},\n\nGrazie per esserti registrato!`,
    html: `<p>Ciao ${nome},</p><p>Grazie per esserti registrato!</p>`
  };

  sendgrid.send(msg).catch((error) => console.error('Errore invio email:', error));
};

// Registrazione
router.post('/register', uploadDocuments.fields([
  { name: 'documentoIdentita', maxCount: 1 },
  { name: 'patente', maxCount: 1 }
]), async (req, res) => {
  const { nome, cognome, email, password, dataNascita } = req.body;
  if (!nome || !cognome || !email || !password || !dataNascita) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email già in uso' });

    const documentoIdentita = req.files['documentoIdentita']?.[0]?.path;
    const patente = req.files['patente']?.[0]?.path;

    if (!documentoIdentita || !patente) {
      return res.status(400).json({ message: 'Carica documento identità e patente.' });
    }

    user = new User({ nome, cognome, email, password, dataNascita, documentoIdentita, patente });
    await user.save();

    sendConfirmationEmail(email, nome);

    res.status(201).json({ message: 'Registrazione avvenuta con successo!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore del server: ' + err.message });
  }
});

// Login tradizionale
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password obbligatorie' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email non trovata' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Password errata' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login riuscito', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore del server' });
  }
});

// Avvia Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback di Google OAuth
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  if (!req.user) {
    return res.status(500).json({ message: 'Autenticazione Google fallita' });
  }

  // Genera il JWT manualmente
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Redirecta verso il frontend con il token
  res.redirect(`${process.env.FRONTEND_URL}/google-success?token=${token}`);
});

// Logout
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;
