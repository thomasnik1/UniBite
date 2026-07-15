// 1. Εισαγωγή των εργαλείων
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config(); // Διαβάζει το αρχείο .env

const app = express();
const port = 3000;

// 2. Ρυθμίσεις του Express
app.use(cors()); // Επιτρέπει στο React frontend να επικοινωνεί με τον server
app.use(express.json()); // Επιτρέπει στον server να καταλαβαίνει JSON δεδομένα

// 3. Δημιουργία της σύνδεσης με τη MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// 4. Προσπάθεια σύνδεσης
db.connect((err) => {
    if (err) {
        console.error('Σφάλμα σύνδεσης στη MySQL:', err.message);
        return;
    }
    console.log('Επιτυχής σύνδεση στη βάση unibite_db!');
});

// 5. Εκκίνηση του Server
app.listen(port, () => {
    console.log(`Ο Server του UniBite τρέχει στο http://localhost:${port}`);
});