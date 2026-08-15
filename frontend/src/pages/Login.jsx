import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Εισάγουμε το ρυθμισμένο Axios

function Login() {
    // 1. Τα State (η "μνήμη" του component)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Για να δείχνουμε τα λάθη από το backend
    
    const navigate = useNavigate();

    // 2. Η συνάρτηση που τρέχει όταν πατάμε "Σύνδεση"
    const handleLogin = async (e) => {
        // ΣΤΑΜΑΤΑΕΙ το default refresh της σελίδας που κάνει η HTML στις φόρμες
        e.preventDefault(); 
        setError(''); // Καθαρίζουμε παλιά λάθη

        try {
            // 3. Στέλνουμε το POST Request στο Backend (Δες το URL σου, π.χ. /users/login ή /auth/login)
            const response = await api.post('/users/login', {
                username: username,
                password: password
            });

            // 4. Αν πετύχει, παίρνουμε το Token από το response
            // (Προσάρμοσε το response.data.token ανάλογα με το πώς το στέλνει το δικό σου Backend)
            const token = response.data.token; 

            // 5. Το αποθηκεύουμε στο Local Storage του browser για να μην το χάσουμε σε refresh
            localStorage.setItem('token', token);

            console.log('Επιτυχής σύνδεση! Το token αποθηκεύτηκε.');

            // 6. Τον "πετάμε" αυτόματα στη σελίδα με τις αγγελίες
            navigate('/ads');

        } catch (err) {
            // Αν το Backend μας γυρίσει σφάλμα (π.χ. 401 Λάθος Κωδικός ή 400 από το Joi)
            // Ψάχνουμε να βρούμε το μήνυμα μέσα στο err.response.data
            console.error(err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Κάτι πήγε στραβά. Προσπαθήστε ξανά.');
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            <h2>Σύνδεση 🔐</h2>
            
            {/* Αν υπάρχει error, το δείχνουμε με κόκκινα γράμματα */}
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div>
                    <label>Username:</label><br />
                    <input 
                        type="Username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Ενημερώνει το State σε κάθε πληκτρολόγηση
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label>Κωδικός:</label><br />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Σύνδεση
                </button>
            </form>
        </div>
    );
}

export default Login;