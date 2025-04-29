# Rental Car Italy - Capstone Project

Benvenuti su **Rental Car Italy**, la piattaforma di autonoleggio completa sviluppata come progetto finale per il corso Epicode.

## 📋 Funzionalità principali

- **Registrazione** e **login** utenti (classico + accesso tramite **Google OAuth**).
- **Prenotazione autonoleggio** con selezione date, auto disponibili, tipo di noleggio.
- **Dashboard personale**: visualizzazione storico prenotazioni, dati utente.
- **Sistema di pagamento simulato**: inserimento dati carta (no pagamento reale).
- **Gestione backend Node.js + Express** collegato a **MongoDB**.
- **Frontend moderno** realizzato in **React** con **Bootstrap**.

---

## 🏗️ Tecnologie utilizzate

- **Frontend**: React.js, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Autenticazione**: JWT + Google OAuth 2.0
- **Upload immagini**: Multer
- **Protezione delle rotte**: Middleware di autenticazione

---

## 📂 Struttura del progetto

```plaintext
/backend
  |- auth/
  |- models/
  |- routes/
  |- middleware/
  |- config/
  |- uploads/
  |- server.js
  |- .env

/frontend
  |- src/
    |- components/
    |- pages/
    |- protection/
    |- styles/
    |- index.js
    |- App.js/
    |- index.css
    |- reportWebVitals.js
    |- setupTests.js

  |- public/
    |- assets/
  |- App.js
  |- .env
  .gitignore
  |- AuthSuccess.js
  |- package.json
  |- README.md