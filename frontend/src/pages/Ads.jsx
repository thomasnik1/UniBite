import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import api from '../services/api'; // Προσοχή να είναι σωστό το path για το Axios!

function Ads() {
    // 1. Δημιουργούμε τα State
    const [ads, setAds] = useState([]); // Εδώ θα μπαίνουν οι αγγελίες από τη βάση
    const [loading, setLoading] = useState(true); // Για να δείχνουμε ένα "Φορτώνει..."
    const [error, setError] = useState(''); // Για τυχόν σφάλματα

    // 2. Το useEffect τρέχει ΜΙΑ φορά μόλις φορτώσει η σελίδα
    useEffect(() => {
        const fetchAds = async () => {
            try {
                // ΒΑΛΕ ΕΔΩ ΤΟ ΣΩΣΤΟ ENDPOINT ΤΟΥ BACKEND ΣΟΥ (π.χ. '/ads' ή '/posts')
                const response = await api.get('/ads/feed'); 
                
                // Υποθέτουμε ότι το backend επιστρέφει έναν πίνακα με τις αγγελίες
                setAds(response.data); 
                setLoading(false);
            } catch (err) {
                console.error("Σφάλμα κατά τη φόρτωση αγγελιών:", err);
                setError('Δεν μπορέσαμε να φορτώσουμε τις αγγελίες.');
                setLoading(false);
            }
        };

        fetchAds();
    }, []); // Ο άδειος πίνακας [] σημαίνει "τρέξε μόνο στην αρχή"

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Διαθέσιμες Αγγελίες 🍲</h2>

            {/* Εμφάνιση μηνυμάτων φόρτωσης ή λάθους */}
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* 3. Εμφάνιση των δεδομένων με τη μέθοδο .map() */}
            {!loading && !error && (
                <Row>
                    {ads.map((ad) => (
                        <Col md={4} key={ad.id} className="mb-4">
                            <Card className="shadow-sm h-100">
                                <Card.Body className="d-flex flex-column">
                                    {/* Προσάρμοσε τα ad.title, ad.portions κλπ. 
                                        ανάλογα με το πώς λέγονται τα πεδία στη βάση σου! */}
                                    <Card.Title>{ad.title}</Card.Title>
                                    <Card.Text>
                                        <strong>Μερίδες:</strong> {ad.portions} <br />
                                        <strong>Περιοχή:</strong> {ad.location}
                                    </Card.Text>
                                    
                                    {/* Το mt-auto σπρώχνει το κουμπί πάντα στο κάτω μέρος της κάρτας */}
                                    <Button variant="primary" className="w-100 mt-auto">
                                        Δέσμευση
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default Ads;