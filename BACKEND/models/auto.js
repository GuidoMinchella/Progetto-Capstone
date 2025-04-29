const mongoose = require('mongoose');

const AutoSchema = new mongoose.Schema({
  marca: { type: String, required: true },
  modello: { type: String, required: true },
  anno: { type: Number, required: true },
  chilometraggio: { type: Number, required: true },
  prezzoGiornaliero: { type: Number, required: true },
  disponibilita: { type: Boolean, default: true },
  tipologia: {
    type: String,
    enum: ['city car', 'berline', 'SUV', 'fuoristrada', 'monovolume', 'auto ibrida'],
    required: true
  },
  immagine: { type: String }
});

module.exports = mongoose.model('Auto', AutoSchema);
