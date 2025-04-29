const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user'); 

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/api/auth/google/callback",
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  console.log('Google OAuth profile:', profile);

  try {
    if (!profile || !profile.id) {
      return done(new Error("Google profile not found or missing ID"), null);
    }

    // 🔵 Prima cerca se esiste già l'utente con questo Google ID
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // 🔵 Se non trovato, cerca per email
      user = await User.findOne({ email: profile.emails?.[0]?.value });

      if (user) {
        // 🔵 Se utente trovato per email, aggiorna il googleId
        user.googleId = profile.id;
        await user.save();
      } else {
        // 🔵 Se non trovato né googleId né email, crea nuovo utente
        user = new User({
          googleId: profile.id,
          nome: profile.name?.givenName || 'Non disponibile',
          cognome: profile.name?.familyName || 'Non disponibile',
          email: profile.emails?.[0]?.value || 'non disponibile',
          patente: null,
          documentoIdentita: null,
          dataNascita: null,
          password: null
        });
        await user.save();
      }
    }

    done(null, user);

  } catch (err) {
    console.error('Errore durante autenticazione Google:', err);
    done(err, null);
  }
}));
