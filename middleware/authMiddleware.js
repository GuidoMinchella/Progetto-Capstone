const jwt = require('jsonwebtoken');
const User = require('../models/user');  // Assuming you have a user model to save user data

// Middleware to protect routes that require authentication
const protect = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Divide "Bearer" and the token

  if (!token) {
    return res.status(401).json({ message: 'Token mancante' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token validity
    req.user = decoded.id; // Save the user ID to the request object
    next(); // Continue to the next middleware or route
  } catch (err) {
    res.status(401).json({ message: 'Token non valido' });
  }
};

// Middleware to handle login or registration of the user through Google
const authenticateOrRegisterUser = async (profile) => {
  try {
    // Check if the user already exists in the database by their Google ID
    let user = await User.findOne({ googleId: profile.id });

    // If the user doesn't exist, create a new one
    if (!user) {
      user = new User({
        googleId: profile.id,
        email: profile.email,
        nome: profile.name.givenName,
        cognome: profile.name.familyName,
      });

      await user.save();
    }

    // Return the user object
    return user;
  } catch (err) {
    console.error('Error in user authentication/registration:', err);
    throw err;
  }
};

module.exports = { protect, authenticateOrRegisterUser };
