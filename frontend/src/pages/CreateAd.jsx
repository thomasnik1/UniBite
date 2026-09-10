import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import api from '../services/api'; 

function CreateAd() {
    const [title, setTitle] = useState('');
    const [portions, setPortions] = useState(1);
    const [pickupLocation, setPickupLocation] = useState('');
    const [pickupTime, setPickupTime] = useState(new Date());
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Προσοχή: Βάλε το σωστό endpoint του backend σου για δημιουργία αγγελίας!
            await api.post('/ads/create', {
                title,
                portions: Number(portions),
                pickupLocation: pickupLocation,
                pickupTime: pickupTime.toISOString() // Στέλνουμε το χρόνο σε ISO format
            });

            // Μόλις φτιαχτεί η αγγελία, τον στέλνουμε πίσω στη λίστα με τις αγγελίες
            navigate('/ads');
        } catch (err) {
            setError('Αποτυχία δημιουργίας αγγελίας. Δοκιμάστε ξανά.');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '600px' }}>
            <Card className="shadow-sm">
                <Card.Body>
                    <h3 className="text-center mb-4">Δημιουργία Νέας Αγγελίας 🍳</h3>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Τίτλος (π.χ. Μακαρόνια με Κιμά)</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Αριθμός Μερίδων</Form.Label>
                            <Form.Control 
                                type="number" 
                                min="1"
                                value={portions}
                                onChange={(e) => setPortions(e.target.value)}
                                required 
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Περιοχή Παραλαβής</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={pickupLocation}
                                onChange={(e) => setPickupLocation(e.target.value)}
                                required 
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Χρόνος Παραλαβής</Form.Label>
                            <Form.Control 
                                type="datetime-local" 
                                value={pickupTime.toISOString().slice(0,16)}
                                onChange={(e) => setPickupTime(new Date(e.target.value))}
                                required 
                            />
                        </Form.Group>

                        <Button variant="success" type="submit" className="w-100">
                            Δημοσίευση Αγγελίας
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default CreateAd;