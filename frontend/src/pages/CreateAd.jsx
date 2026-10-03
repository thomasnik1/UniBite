import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import api from '../services/api';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

function CreateAd() {
    const [title, setTitle] = useState('');
    const [portions, setPortions] = useState(1);
    const [pickupLocationDetails, setPickupLocationDetails] = useState('');
    const [pickupTime, setPickupTime] = useState(new Date());
    const [error, setError] = useState('');
    const [position, setPosition] = useState({ lat: 37.9753, lng: 23.7361 });
    
    // 1. Νέο state για την αποθήκευση του αρχείου της εικόνας
    const [image, setImage] = useState(null);
    
    const navigate = useNavigate();

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
            // 2. Χρήση FormData αντί για απλό αντικείμενο JSON για να περάσουμε αρχείο
            const formData = new FormData();
            formData.append('title', title);
            formData.append('portions', Number(portions));
            formData.append('latitude', position.lat);
            formData.append('longitude', position.lng);
            formData.append('pickupLocationDetails', pickupLocationDetails);
            formData.append('pickupTime', pickupTime.toISOString());
            
            // Αν ο χρήστης έχει επιλέξει εικόνα, την προσθέτουμε στο formData
            if (image) {
                formData.append('image', image);
            }

            // 3. Στέλνουμε το formData με το κατάλληλο header για αρχεία
            await api.post('/ads/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/ads');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(`Λάθος από το Backend: ${err.response.data.error}`);
            } else {
                setError('Αποτυχία δημιουργίας αγγελίας. Δοκιμάστε ξανά.');
            }
        }
    };

    return (
        <Container className="mt-5 mb-5" style={{ maxWidth: '600px' }}>
            <Card className="shadow-sm">
                <Card.Body>
                    <h3 className="text-center mb-4">Δημιουργία Νέας Αγγελίας</h3>
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
                                placeholder="π.χ. Ερμού 15, 3ος όροφος" 
                                value={pickupLocationDetails}
                                onChange={(e) => setPickupLocationDetails(e.target.value)}
                                required 
                            />
                        </Form.Group>

                        {/* 4. Νέο πεδίο φόρμας για την επιλογή φωτογραφίας */}
                        <Form.Group className="mb-4">
                            <Form.Label>Φωτογραφία Φαγητού (Προαιρετικό)</Form.Label>
                            <Form.Control 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])} 
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>
                                <strong>Ακριβές Σημείο στον Χάρτη</strong> <br/>
                                <small className="text-muted">(Κάνε κλικ στον χάρτη για να επιλέξεις το σημείο)</small>
                            </Form.Label>
                            
                            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #ced4da' }}>
                                <MapContainer 
                                    center={[37.9753, 23.7361]} 
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