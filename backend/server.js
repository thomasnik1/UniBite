const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./source/configuration/database');
const adRoutes = require('./source/routes/adRoutes');
const userRoutes = require('./source/routes/userRoutes');
const requestRoutes = require('./source/routes/requestRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Σύνδεση των Routes
app.use('/api/ads', adRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);

// Έλεγχος σύνδεσης με DB και εκκίνηση Server
sequelize.authenticate()
    .then(() => {
        console.log('Επιτυχής σύνδεση στη βάση μέσω Sequelize!');
        app.listen(port, () => {
            console.log(`Ο Server του UniBite τρέχει στο http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Αποτυχία σύνδεσης στη βάση:', err);
    });

