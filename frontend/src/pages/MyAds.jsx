import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Προσθέσαμε το useNavigate
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import api from '../services/api'; 

function MyAds() {
    const [myAds, setMyAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const navigate = useNavigate(); // Εργαλείο για αλλαγή σελίδας

    useEffect(() => {
        const fetchMyAds = async () => {
            try {
                const response = await api.get('/ads/my-ads'); 
                setMyAds(response.data);
                setLoading(false);
            } catch (err) {
                setError('Δεν μπορέσαμε να φορτώσουμε τις αγγελίες σας.');
                setLoading(false);
            }
        };
        fetchMyAds();
    }, []);

    // 1. Η λειτουργία της Διαγραφής
    const handleDelete = async (adId) => {
        // Ζητάμε επιβεβαίωση από τον χρήστη πριν τη διαγραφή
        const isConfirmed = window.confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την αγγελία;");
        
        if (isConfirmed) {
            try {
                // ΠΡΟΣΟΧΗ: Βάλε το σωστό endpoint διαγραφής του backend σου (π.χ. /ads/:id)
                await api.delete(`/ads/delete/${adId}`);
                
                // Αφαιρούμε την αγγελία από την οθόνη ΧΩΡΙΣ να κάνουμε refresh τη σελίδα!
                setMyAds(myAds.filter((ad) => (ad._id || ad.id) !== adId));
            } catch (err) {
                console.error("Σφάλμα διαγραφής:", err);
                alert("Κάτι πήγε στραβά κατά τη διαγραφή.");
            }
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-4">Οι Αγγελίες Μου 📦</h2>

            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && myAds.length === 0 && (
                <Alert variant="info">Δεν έχετε δημοσιεύσει ακόμα καμία αγγελία.</Alert>
            )}

            {!loading && !error && myAds.length > 0 && (
                <Row>
                    {myAds.map((ad) => (
                        <Col md={4} key={ad._id || ad.id} className="mb-4">
                            <Card className="shadow-sm h-100 border-primary">
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>{ad.title}</Card.Title>
                                    <Card.Text>
                                        <strong>Μερίδες:</strong> {ad.portions} <br />
                                        <strong>Περιοχή:</strong> {ad.pickupLocation} <br />
                                    </Card.Text>
                                    
                                    {/* 2. Τα Κουμπιά Επεξεργασίας και Διαγραφής */}
                                    <div className="mt-auto">
                                        {ad.status === 'deleted' ? (
                                            <div className="text-center p-2 bg-light rounded text-danger border border-danger">
                                                <small className="fw-bold">⚠️ Η αγγελία έχει διαγραφεί</small>
                                            </div>
                                        ) : (
                                            <div className="d-flex gap-2">
                                                <Button 
                                                    variant="warning" 
                                                    className="w-50 text-white"
                                                    onClick={() => navigate(`/ads/edit/${ad._id || ad.id}`)}
                                                >
                                                    Επεξεργασία
                                                </Button>
                                                <Button 
                                                    variant="danger" 
                                                    className="w-50"
                                                    onClick={() => handleDelete(ad._id || ad.id)}
                                                >
                                                    Διαγραφή
                                                </Button>
                                            </div>
                                        )}
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

export default MyAds;