const express = require('express');
const router = express.Router();
const Auto = require('../models/auto');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadCars');

// Aggiungi auto
router.post('/', protect, upload.single('immagine'), async (req, res) => {
  const { marca, modello, anno, chilometraggio, prezzoGiornaliero, disponibilita, tipologia } = req.body;
  const immagine = req.file ? req.file.path : null;

  try {
    const newAuto = new Auto({ marca, modello, anno, chilometraggio, prezzoGiornaliero, disponibilita, tipologia, immagine });
    await newAuto.save();
    res.status(201).json({ message: 'Auto aggiunta con successo!', auto: newAuto });
  } catch (err) {
    res.status(500).json({ message: 'Errore nel salvataggio dell\'auto: ' + err });
  }
});

// Ottieni auto disponibili
router.get('/', async (req, res) => {
  try {
    const autoDisponibili = await Auto.find({ disponibilita: true });
    res.json(autoDisponibili);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero delle auto: ' + err });
  }
});

// Dettaglio auto
router.get('/:id', async (req, res) => {
  try {
    const auto = await Auto.findById(req.params.id);
    if (!auto) return res.status(404).json({ message: 'Auto non trovata' });
    res.json(auto);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero dell\'auto: ' + err });
  }
});

// Modifica auto
router.put('/:id', protect, async (req, res) => {
  const { marca, modello, anno, chilometraggio, prezzoGiornaliero, disponibilita, tipologia } = req.body;

  try {
    const auto = await Auto.findById(req.params.id);
    if (!auto) return res.status(404).json({ message: 'Auto non trovata' });

    auto.marca = marca || auto.marca;
    auto.modello = modello || auto.modello;
    auto.anno = anno || auto.anno;
    auto.chilometraggio = chilometraggio !== undefined ? chilometraggio : auto.chilometraggio;
    auto.prezzoGiornaliero = prezzoGiornaliero || auto.prezzoGiornaliero;
    auto.disponibilita = disponibilita !== undefined ? disponibilita : auto.disponibilita;
    auto.tipologia = tipologia || auto.tipologia;

    await auto.save();
    res.json({ message: 'Auto aggiornata con successo', auto });
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'aggiornamento dell\'auto: ' + err });
  }
});

// Elimina auto
router.delete('/:id', protect, async (req, res) => {
  try {
    const auto = await Auto.findById(req.params.id);
    if (!auto) return res.status(404).json({ message: 'Auto non trovata' });

    await auto.deleteOne();
    res.json({ message: 'Auto eliminata con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'eliminazione dell\'auto: ' + err });
  }
});

module.exports = router;
