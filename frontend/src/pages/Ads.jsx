import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form } from 'react-bootstrap';
import api from '../services/api'; 

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function Ads() {
    const [ads, setAds] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(''); 
    const [selectedPortions, setSelectedPortions] = useState({});

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await api.get('/ads/feed'); 
                setAds(response.data); 
                setLoading(false);
            } catch (err) {
                console.error("Σφάλμα κατά τη φόρτωση αγγελιών:", err);
                setError('Δεν μπορέσαμε να φορτώσουμε τις αγγελίες.');
                setLoading(false);
            }
        };

        fetchAds();
    }, []); 

    // Η νέα λειτουργία για τη δέσμευση
const handleReserve = async (adId, availablePortions) => {
        // Αν ο χρήστης δεν έχει επιλέξει κάτι, θεωρούμε ότι θέλει 1 μερίδα
        const requestedAmount = selectedPortions[adId] || 1;
        
        if (requestedAmount > availablePortions) {
            alert("Δεν υπάρχουν τόσες διαθέσιμες μερίδες!");
            return;
        }

        const isConfirmed = window.confirm(`Θέλετε να δεσμεύσετε ${requestedAmount} μερίδα/ες;`);
        
        if (isConfirmed) {
            try {
                // Στέλνουμε στο POST endpoint τα δεδομένα (ανάλογα πώς τα περιμένει το Backend σου)
                await api.post('/requests/create', {
                    adId: adId,
                    portions: requestedAmount
                });
                
                // Ενημερώνουμε την οθόνη: Αφαιρούμε τις μερίδες και κρύβουμε την αγγελία αν πήγαν στο 0
                setAds(ads.map(ad => {
                    if ((ad._id || ad.id) === adId) {
                        return { ...ad, portions: ad.portions - requestedAmount };
                    }
                    return ad;
                }).filter(ad => ad.portions > 0));
                
                alert("Το αίτημά σας καταχωρήθηκε με επιτυχία!");
            } catch (err) {
                console.error("Σφάλμα δέσμευσης:", err);
                alert("Αποτυχία καταχώρησης αιτήματος.");
            }
        }
    };

    const athensCenter = [37.9753, 23.7361];

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Διαθέσιμες Αγγελίες 🍲</h2>

            {/* Ο ΧΑΡΤΗΣ ΜΑΣ */}
            <div className="mb-5 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <MapContainer center={athensCenter} zoom={13} style={{ height: '400px', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* ΔΥΝΑΜΙΚΗ ΕΜΦΑΝΙΣΗ ΠΙΝΕΖΩΝ */}
                    {/* Περιμένουμε να φορτώσουν οι αγγελίες και μετά τις κάνουμε loop */}
                    {!loading && ads.map((ad) => {
                        // Βάζουμε μια δικλείδα ασφαλείας: Ζωγράφισε πινέζα ΜΟΝΟ αν η αγγελία έχει συντεταγμένες
                        // (Αυτό προστατεύει τον χάρτη από το να "κράσαρει" αν έχεις παλιές αγγελίες στη βάση χωρίς lat/lng)
                        if (ad.latitude && ad.longitude) {
                            return (
                                <Marker key={ad._id || ad.id} position={[ad.latitude, ad.longitude]}>
                                    <Popup>
                                        <strong>{ad.title}</strong> <br />
                                        <em>Μερίδες: {ad.portions}</em> <br />
                                        Οδηγίες: {ad.pickupLocation}
                                    </Popup>
                                </Marker>
                            );
                        }
                        return null; // Αν δεν έχει συντεταγμένες, μην ζωγραφίσεις τίποτα
                    })}
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
                                    <div className="mt-auto">
                                        <div className="d-flex gap-2 mb-2 align-items-center">
                                            <small className="fw-bold text-nowrap">Ποσότητα:</small>
                                            <Form.Control 
                                                type="number" 
                                                min="1" 
                                                max={ad.portions}
                                                value={selectedPortions[ad._id || ad.id] || 1}
                                                onChange={(e) => setSelectedPortions({
                                                    ...selectedPortions,
                                                    [ad._id || ad.id]: Number(e.target.value)
                                                })}
                                            />
                                        </div>
                                        <Button 
                                            variant="primary" 
                                            className="w-100 fw-bold"
                                            onClick={() => handleReserve(ad._id || ad.id, ad.portions)}
                                        >
                                            Δέσμευση
                                        </Button>
                                    </div>
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