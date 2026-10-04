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

    const handleAccept = async (reqId) => {
        try {
            await api.put(`/requests/accept/${reqId}`);
            
            setIncomingRequests(incomingRequests.map(req => 
                (req._id || req.id) === reqId ? { ...req, status: 'approved' } : req
            ));
        } catch (err) {
            alert('Αποτυχία αποδοχής του αιτήματος.');
        }
    };

    const handleReject = async (reqId) => {
        const isConfirmed = window.confirm("Είστε σίγουροι ότι θέλετε να απορρίψετε αυτό το αίτημα;");
        if (isConfirmed) {
            try {
                await api.put(`/requests/reject/${reqId}`);
                
                setIncomingRequests(incomingRequests.map(req => 
                    (req._id || req.id) === reqId ? { ...req, status: 'rejected' } : req
                ));
            } catch (err) {
                alert('Αποτυχία απόρριψης του αιτήματος.');
            }
        }
    };

    const handleConfirmPickup = async (reqId) => {
        try {
            await api.put(`/requests/confirm/${reqId}`);
            
            setIncomingRequests(incomingRequests.map(req => 
                // ΔΙΟΡΘΩΘΗΚΕ: Αλλαγή σε 'completed' για να εμφανιστεί το σωστό Badge και να κρυφτεί το κουμπί
                (req._id || req.id) === reqId ? { ...req, isPickedUp: true } : req 
            ));
            alert('Η παραλαβή επιβεβαιώθηκε επιτυχώς!');
        } catch (err) {
            console.error("Σφάλμα επιβεβαίωσης παραλαβής:", err);
            alert('Αποτυχία επιβεβαίωσης της παραλαβής.');
        }
    };

    const handleReportNoShow = async (requestId) => {
        const isConfirmed = window.confirm("Είστε σίγουροι ότι ο χρήστης δεν εμφανίστηκε; Θα του επιβληθεί ποινή.");
        if (isConfirmed) {
            try {
                // ΣΗΜΕΙΩΣΗ: Αν το backend Joi Schema απαιτεί και το adId, 
                // θα πρέπει να το στείλεις ως body: await api.put(`/requests/report/${reqId}`, { adId: ... })
                await api.put(`/requests/report/${requestId}`);
                
                setIncomingRequests(incomingRequests.map(req => 
                    (req._id || req.id) === requestId ? { ...req, noShowReported: true } : req
                ));
                alert('Η αναφορά καταχωρήθηκε επιτυχώς.');
            } catch (err) {
                console.error("Σφάλμα αναφοράς:", err);
                alert('Αποτυχία καταχώρησης αναφοράς.');
            }
        }
    };

    const getStatusBadge = (req) => {
        if ((req.status === 'approved' && req.isPickedUp )) {
            return <Badge bg="info">Ολοκληρώθηκε</Badge>;
        }

        if (( req.status === 'approved' && req.noShowReported )) {
            return <Badge bg="danger">Δεν Εμφανίστηκε</Badge>;
        }

        switch (req.status) {
            case 'pending': return <Badge bg="warning" text="dark">Σε Αναμονή</Badge>;
            case 'approved': return <Badge bg="success">Έγινε Αποδοχή!</Badge>;
            case 'rejected': return <Badge bg="danger">Απορρίφθηκε</Badge>;
            default: return <Badge bg="secondary">{req.status}</Badge>;
        }
    };

    const handleCreateRating = (requestId) => {
        // Εδώ μπορείς μελλοντικά να ανοίξεις ένα Modal ή να κάνεις redirect στο route της αξιολόγησης
        alert(`Άνοιγμα φόρμας αξιολόγησης για το αίτημα με ID: ${reqId}`);
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
                                {incomingRequests.map(req => {                                    
                                    const currentRequestId = req._id || req.id; 
                                    
                                    return (
                                        <Col md={6} lg={4} key={currentRequestId} className="mb-4">
                                            <Card className="shadow-sm border-primary h-100">
                                                <Card.Body className="d-flex flex-column">
                                                    <Card.Title>Αγγελία: {req.ad?.title}</Card.Title>
                                                    <Card.Text>
                                                        <strong>Από Χρήστη:</strong> { req.requester?.username } <br/>
                                                        <strong>Ζητούμενες Μερίδες:</strong> {req.portions} <br/>
                                                        <strong>Κατάσταση:</strong> {getStatusBadge(req)}
                                                    </Card.Text>
                                                
                                                {req.status === 'pending' && (
                                                    <div className="mt-auto d-flex gap-2">
                                                        <Button variant="success" className="w-50" onClick={() => handleAccept(currentRequestId)}>
                                                            Αποδοχή
                                                        </Button>
                                                        <Button variant="danger" className="w-50" onClick={() => handleReject(currentRequestId)}>
                                                            Απόρριψη
                                                        </Button>
                                                    </div>
                                                )}

                                                {(req.status === 'approved' && !req.isPickedUp && !req.noShowReported ) && (
                                                    <div className="mt-auto d-flex flex-column gap-2">
                                                        <Button 
                                                            variant="info" 
                                                            className="w-100 fw-bold text-white mt-2" 
                                                            onClick={() => handleConfirmPickup(currentRequestId)}
                                                        >
                                                            Επιβεβαίωση Παραλαβής
                                                        </Button>
                                                        <Button 
                                                            variant="outline-danger" 
                                                            className="w-100 fw-bold" 
                                                            onClick={() => handleReportNoShow(currentRequestId)}
                                                        >
                                                            Αναφορά Μη Εμφάνισης
                                                        </Button>
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    );
                                })}
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
                                                    <strong>Κατάσταση:</strong> {getStatusBadge(req)}
                                                </Card.Text>
                                                
                                                {(req.status === 'accepted' || req.status === 'approved') && (
                                                    <Alert variant="success" className="mt-auto mb-0">
                                                        <small>Οδηγίες: {req.ad?.pickupLocationDetails}</small>
                                                    </Alert>
                                                )}

                                                {req.status === 'approved' && (
                                                        <div className="mt-2">
                                                            {req.isPickedUp && !req.noShowReport ? (
                                                                <Button 
                                                                    variant="warning" 
                                                                    className="w-100 fw-bold text-dark"
                                                                    onClick={() => handleCreateRating(currentRequestId)}
                                                                >
                                                                    Δημιουργία Αξιολόγησης
                                                                </Button>
                                                            ) : (
                                                                req.noShowReported ? (
                                                                    <Alert variant="danger" className="mb-0 text-center" style={{ fontSize: '0.85rem' }}>
                                                                        Ο χρήστης δεν εμφανίστηκε και έχει επιβληθεί ποινή.
                                                                    </Alert>
                                                                ) : (
                                                                <Alert variant="secondary" className="mb-0 text-center" style={{ fontSize: '0.85rem' }}>
                                                                    Η δυνατότητα αξιολόγησης θα ξεκλειδωθεί μόλις ο δημιουργός επιβεβαιώσει την παραλαβή.
                                                                </Alert>
                                                            ))}
                                                        </div>
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