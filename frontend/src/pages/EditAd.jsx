import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import api from '../services/api'; 
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

function EditAd() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [portions, setPortions] = useState(1);
    const [pickupLocationDetails, setPickupLocationDetails] = useState('');
    const [pickupTime, setPickupTime] = useState(new Date());
    const [position, setPosition] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const response = await api.get(`ads/my-ads/${id}`); 
                const ad = response.data;
                console.log("Δεδομένα που ήρθαν από το Backend:", ad);

                setTitle(ad.title);
                setPortions(ad.portions);
                setPickupLocationDetails(ad.pickupLocationDetails);
                setPickupTime(new Date(ad.pickupTime));
                setPosition({ lat: ad.latitude, lng: ad.longitude });
                
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Δεν μπορέσαμε να φορτώσουμε τα στοιχεία της αγγελίας.');
                setLoading(false);
            }
        };

        fetchAd();
    }, [id]);

    function LocationMarker() {
        useMapEvents({
            click(e) {
                setPosition(e.latlng);
            },
        });
        return position === null ? null : ( 
            <Marker position={position}></Marker>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await api.patch(`/ads/edit/${id}`, {
                title,
                portions: Number(portions),
                latitude: position.lat,
                longitude: position.lng,
                pickupLocationDetails: pickupLocationDetails,
                pickupTime: pickupTime.toISOString()
            });

            navigate('/my-ads');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                setError(`Λάθος: ${err.response.data.errors.join(', ')}`);
            } else {
                setError('Αποτυχία ενημέρωσης αγγελίας. Δοκιμάστε ξανά.');
            }
        }
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" />
                <p>Φόρτωση αγγελίας...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-5 mb-5" style={{ maxWidth: '600px' }}>
            <Card className="shadow-sm">
                <Card.Body>
                    <h3 className="text-center mb-4">Επεξεργασία Αγγελίας ✏️</h3>
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

                        <Row>
                            <Col md={6}>
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
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Χρόνος Παραλαβής</Form.Label>
                                    <Form.Control 
                                        type="datetime-local" 
                                        value={pickupTime.toISOString().slice(0,16)}
                                        onChange={(e) => setPickupTime(new Date(e.target.value))}
                                        required 
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-4">
                            <Form.Label>Οδός / Λεπτομέρειες Παραλαβής</Form.Label>
                            <Form.Control 
                                type="text"
                                value={pickupLocationDetails}
                                onChange={(e) => setPickupLocationDetails(e.target.value)}
                                required 
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>
                                <strong>Ακριβές Σημείο στον Χάρτη</strong> <br/>
                                <small className="text-muted">(Κάνε κλικ στον χάρτη για να μετακινήσεις την πινέζα)</small>
                            </Form.Label>
                            
                            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #ced4da' }}>
                                <MapContainer 
                                    center={[position.lat, position.lng]} 
                                    zoom={14} 
                                    style={{ height: '300px', width: '100%' }}
                                >
                                    <TileLayer
                                        attribution='&copy; OpenStreetMap'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <LocationMarker />
                                </MapContainer>
                            </div>
                        </Form.Group>

                        <Button variant="warning" type="submit" className="w-100 text-white">
                            Αποθήκευση Αλλαγών
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default EditAd;