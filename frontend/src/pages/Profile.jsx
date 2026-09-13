import { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import api from '../services/api';

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Υποθέτοντας ότι έχεις endpoint στο backend για τα στοιχεία του τρέχοντος χρήστη
                const response = await api.get('/users/me');
                setUser(response.data.user || []);
                setLoading(false);
            } catch (err) {
                console.error("Σφάλμα φόρτωσης προφίλ:", err);
                setError('Δεν μπορέσαμε να φορτώσουμε τα στοιχεία του προφίλ.');
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <Container className="mt-5" style={{ maxWidth: '600px' }}>
            <h2 className="mb-4">Το Προφίλ Μου 👤</h2>

            {loading && <div className="text-center"><Spinner animation="border" /></div>}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && user && (
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title className="mb-3">Στοιχεία Χρήστη</Card.Title>
                        <Card.Text>
                            <strong>Username:</strong> {user.username} <br />
                            <strong>Email:</strong> {user.email} <br />
                            <strong>Credits:</strong> {user.credits} <br />
                            <strong>Ρόλος:</strong> {user.role}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}

export default Profile;