const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const router = express.Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Reindirizza al frontend con il token
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
  });

module.exports = router;
