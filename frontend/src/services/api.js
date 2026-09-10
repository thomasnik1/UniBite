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

export default api;