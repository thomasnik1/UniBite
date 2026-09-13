import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Εισάγουμε το ρυθμισμένο Axios
import { AuthContext } from '../context/AuthContext'; 


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); 

    const handleLogin = async (e) => {
        e.preventDefault(); 
        setError('');

        try {
            const response = await api.post('/users/login', {
                username: username,
                password: password
            });
            const token = response.data.token || response.data.result?.token; 
            const fetchedUsername = response.data.result?.user?.username;
            localStorage.setItem('username', fetchedUsername);

            login(token);
            navigate('/ads');

        } catch (err) {
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
            
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div>
                    <label>Username:</label><br />
                    <input 
                        type="Username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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