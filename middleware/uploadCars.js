const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configura Cloudinary con le tue credenziali
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configura lo storage per Multer utilizzando Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'auto_images',  // Cartella su Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],  // Formati consentiti
    transformation: [{ width: 500, height: 500, crop: 'limit' }]  // Trasformazioni opzionali
  }
});

// Crea il middleware per il caricamento dei file
const upload = multer({ storage: storage });

module.exports = upload;
