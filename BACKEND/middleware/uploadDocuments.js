const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configura Cloudinary per i documenti
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configura lo storage per Multer con Cloudinary per i documenti
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_documents',  // Cartella separata per i documenti
    allowed_formats: ['jpg', 'jpeg', 'png'],  // Formati consentiti
    transformation: [{ width: 500, height: 500, crop: 'limit' }]  // Trasformazioni opzionali
  }
});

// Crea il middleware di Multer per caricare i file (documento di identità e patente)
const uploadDocuments = multer({ storage: storage });

module.exports = uploadDocuments;
