import axios from 'axios';

// 1. Δημιουργούμε το βασικό "όχημα" του Axios
const api = axios.create({
    // ΠΡΟΣΟΧΗ: Βάλε εδώ το σωστό URL του Backend σου!
    baseURL: 'http://localhost:3000/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

// 2. Ο Interceptor: Παρεμβαίνει ΠΡΙΝ φύγει κάθε αίτημα
api.interceptors.request.use(
    (config) => {
        // Ψάχνουμε το token στο LocalStorage
        const token = localStorage.getItem('token');

        // Αν υπάρχει token, το βάζουμε στο header "Authorization"
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        // Αν η απάντηση είναι επιτυχής, απλά την προωθούμε
        return response;
    },
    (error) => {
        // Αν το backend στείλει 401 Unauthorized (Ληγμένο/Άκυρο Token)
        if (error.response && error.response.status === 403) {
            // Σβήνουμε το χαλασμένο token από τον browser
            localStorage.removeItem('token');
            
            // Τον πετάμε έξω στην αρχική σελίδα (ή στο /login)
            // Χρησιμοποιούμε window.location γιατί είμαστε εκτός React Router components
            window.location.href = '/'; 
        }
        
        return Promise.reject(error);
    }
);

export default api;