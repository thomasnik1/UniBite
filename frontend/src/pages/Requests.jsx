import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Tabs, Tab, Badge } from 'react-bootstrap';
import api from '../services/api';

function Requests() {
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const incomingRes = await api.get('/requests/incoming');
                const outgoingRes = await api.get('/requests/outgoing');
                
                setIncomingRequests(incomingRes.data.result || []);
                setOutgoingRequests(outgoingRes.data.result || []);
                setLoading(false);
            } catch (err) {
                console.error("Σφάλμα φόρτωσης αιτημάτων:", err);
                setError('Αποτυχία φόρτωσης των αιτημάτων.');
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleAccept = async (requestId) => {
        try {
            await api.put(`/requests/accept/${requestId}`);
            
            setIncomingRequests(incomingRequests.map(req => 
                (req._id || req.id) === requestId ? { ...req, status: 'accepted' } : req
            ));
        } catch (err) {
            alert('Αποτυχία αποδοχής του αιτήματος.');
        }
    };

    const handleReject = async (requestId) => {
        const isConfirmed = window.confirm("Είστε σίγουροι ότι θέλετε να απορρίψετε αυτό το αίτημα;");
        if (isConfirmed) {
            try {
                await api.put(`/requests/reject/${requestId}`);
                
                setIncomingRequests(incomingRequests.map(req => 
                    (req._id || req.id) === requestId ? { ...req, status: 'rejected' } : req
                ));
            } catch (err) {
                alert('Αποτυχία απόρριψης του αιτήματος.');
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <Badge bg="warning" text="dark">Σε Αναμονή</Badge>;
            case 'approved': return <Badge bg="success">Έγινε Αποδοχή!</Badge>;
            case 'rejected': return <Badge bg="danger">Απορρίφθηκε</Badge>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };

    return (
        <Container className="mt-5 mb-5">
            <h2 className="mb-4">Διαχείριση Αιτημάτων</h2>

            {loading && <div className="text-center"><Spinner animation="border" /></div>}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && (
                <Tabs defaultActiveKey="incoming" className="mb-4">
                    
                    <Tab eventKey="incoming" title="Εισερχόμενα (Προς εμένα)">
                        {incomingRequests.length === 0 ? (
                            <Alert variant="info">Δεν έχετε νέα αιτήματα για τις αγγελίες σας.</Alert>
                        ) : (
                            <Row>
                                {incomingRequests.map(req => (
                                    <Col md={6} lg={4} key={req._id || req.id} className="mb-4">
                                        <Card className="shadow-sm border-primary h-100">
                                            <Card.Body className="d-flex flex-column">
                                                <Card.Title>Αγγελία: {req.ad?.title}</Card.Title>
                                                <Card.Text>
                                                    <strong>Από Χρήστη:</strong> {req.consumer?.username || req.User?.username || `ID: ${req.consumerId}`} <br/>
                                                    <strong>Ζητούμενες Μερίδες:</strong> {req.portions} <br/>
                                                    <strong>Κατάσταση:</strong> {getStatusBadge(req.status)}
                                                </Card.Text>
                                                
                                                {req.status === 'pending' && (
                                                    <div className="mt-auto d-flex gap-2">
                                                        <Button variant="success" className="w-50" onClick={() => handleAccept(req._id || req.id)}>
                                                            Αποδοχή
                                                        </Button>
                                                        <Button variant="danger" className="w-50" onClick={() => handleReject(req._id || req.id)}>
                                                            Απόρριψη
                                                        </Button>
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Tab>

                    <Tab eventKey="outgoing" title="Τα Αιτήματά Μου">
                        {outgoingRequests.length === 0 ? (
                            <Alert variant="info">Δεν έχετε στείλει ακόμα κανένα αίτημα.</Alert>
                        ) : (
                            <Row>
                                {outgoingRequests.map(req => (
                                    <Col md={6} lg={4} key={req._id || req.id} className="mb-4">
                                        <Card className="shadow-sm h-100">
                                            <Card.Body className="d-flex flex-column">
                                                <Card.Title>Αγγελία: {req.ad?.title}</Card.Title>
                                                <Card.Text>
                                                    <strong>Ζητήσατε:</strong> {req.portions} μερίδα/ες <br/>
                                                    <strong>Κατάσταση:</strong> {getStatusBadge(req.status)}
                                                </Card.Text>
                                                
                                                {req.status === 'approved' && (
                                                    <Alert variant="success" className="mt-auto mb-0">
                                                        <small>Οδηγίες: {req.ad?.pickupLocationDetails}</small>
                                                    </Alert>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Tab>
                </Tabs>
            )}
        </Container>
    );
}

export default Requests;