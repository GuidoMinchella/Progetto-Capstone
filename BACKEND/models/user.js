const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // ✅ NON required, perché Google login non ha password
  nome: { type: String },
  cognome: { type: String },
  dataNascita: { type: Date }, // ✅ NON required
  documentoIdentita: { type: String }, // ✅ NON required
  patente: { type: String }, // ✅ NON required
  // ... altri campi
});

// Hash della password prima di salvarla nel database
UserSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Metodo per confrontare la password inserita con quella salvata
UserSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};


module.exports = mongoose.model('User', UserSchema);
