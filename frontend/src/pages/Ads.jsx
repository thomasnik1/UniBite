import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import api from '../services/api'; // Προσοχή να είναι σωστό το path για το Axios!

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

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

const athensCenter = [37.9753, 23.7361];

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Διαθέσιμες Αγγελίες 🍲</h2>

            {/* 2. Ο ΧΑΡΤΗΣ ΜΑΣ */}
            <div className="mb-5 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                {/* ΠΡΟΣΟΧΗ: Ο χάρτης ΠΡΕΠΕΙ να έχει καθορισμένο ύψος, αλλιώς εξαφανίζεται! */}
                <MapContainer center={athensCenter} zoom={13} style={{ height: '400px', width: '100%' }}>
                    {/* Το TileLayer είναι η "ταπετσαρία" του χάρτη (οι δρόμοι κλπ) */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* 3. Μια δοκιμαστική "Πινέζα" (Marker) */}
                    <Marker position={athensCenter}>
                        <Popup>
                            <strong>Μακαρόνια με Κιμά</strong> <br />
                            Κέντρο Αθήνας
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>

            {/* Εμφάνιση μηνυμάτων φόρτωσης/λάθους */}
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Εμφάνιση των Καρτών */}
            {!loading && !error && (
                <Row>
                    {ads.map((ad) => (
                        <Col md={4} key={ad._id || ad.id} className="mb-4">
                            <Card className="shadow-sm h-100">
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>{ad.title}</Card.Title>
                                    <Card.Text>
                                        <strong>Μερίδες:</strong> {ad.portions} <br />
                                        <strong>Περιοχή:</strong> {ad.pickupLocation}
                                    </Card.Text>
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