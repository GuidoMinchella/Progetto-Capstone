const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

require('./config/passport');

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connesso al database MongoDB'))
  .catch(err => console.log('Errore nella connessione a MongoDB:', err));

// Importa le rotte
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const autoRoutes = require('./routes/autoroutes');
const bookingRoutes = require('./routes/BookingRoutes');

// Usa le rotte
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auto', autoRoutes);
app.use('/api/bookings', bookingRoutes); 

app.listen(port, () => {
  console.log(`Server avviato sulla porta ${port}`);
});