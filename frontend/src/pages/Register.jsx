// 1. Προσθέσαμε το useContext
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext'; 

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    
    const { login } = useContext(AuthContext); 

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await api.post('/users/create', {
                username: username,
                email: email,
                password: password
            });
            const token = response.data.token || response.data.result?.token; 

            login(token);

            setSuccess('Επιτυχής εγγραφή! Μεταφέρεστε στις αγγελίες...');
            
            setTimeout(() => {
                navigate('/ads');
            }, 150);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Κάτι πήγε στραβά. Δοκιμάστε ξανά.');
            }
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h3 className="text-center mb-4">Εγγραφή 📝</h3>
                            
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form onSubmit={handleRegister}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Όνομα Χρήστη</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="π.χ. super_cook" 
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        placeholder="name@example.com" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Κωδικός</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Τουλάχιστον 6 χαρακτήρες" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    Δημιουργία Λογαριασμού
                                </Button>
                            </Form>
                            
                            <div className="text-center mt-3">
                                <small>
                                    Έχεις ήδη λογαριασμό; <Link to="/login">Συνδέσου εδώ</Link>
                                </small>
                            </div>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Register;