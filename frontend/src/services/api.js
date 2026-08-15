import axios from 'axios';
const api = axios.create({
    // Βάλε εδώ το URL του Backend σου! 
    // Έτσι δεν θα χρειάζεται να γράφεις 'http://localhost:3000...' σε κάθε αίτημα.
    baseURL: 'http://localhost:3000/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

// (Αργότερα εδώ θα προσθέσουμε έναν "Interceptor" 
// που θα βάζει αυτόματα το JWT Token σε κάθε request!)

export default api;