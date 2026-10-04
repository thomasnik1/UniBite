import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Tabs, Tab, Badge, Modal } from 'react-bootstrap';
import api from '../services/api';

function Requests() {
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // States για το Modal Αξιολόγησης που έλειπαν
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [ratingData, setRatingData] = useState({ requestId: null, ratingScore: 0 });
    const [hoveredStar, setHoveredStar] = useState(0); 

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

    const handleOpenRatingModal = (reqId) => {
        setRatingData({ requestId: reqId, ratingScore: 0 });
        setShowRatingModal(true);
    };

    const handleCloseRatingModal = () => {
        setShowRatingModal(false);
        setRatingData({ requestId: null, ratingScore: 0 });
        setHoveredStar(0);
    };

    const handleSubmitRating = async () => {
        if (ratingData.ratingScore === 0) {
            alert("Παρακαλώ επιλέξτε βαθμολογία από 1 έως 5 αστέρια.");
            return;
        }

        try {
            await api.post('/ratings/create', {
                requestId: ratingData.requestId,
                ratingScore: ratingData.ratingScore
            });

            alert('Η αξιολόγηση καταχωρήθηκε επιτυχώς!');
            
            setOutgoingRequests(outgoingRequests.map(req => 
                (req._id || req.id) === ratingData.requestId ? { ...req, isRated: true } : req
            ));
            
            handleCloseRatingModal();
        } catch (err) {
            console.error("Σφάλμα υποβολής αξιολόγησης:", err);
            alert('Αποτυχία καταχώρησης της αξιολόγησης.');
        }
    };
    
    const getStatusBadge = (req) => {
        if (req.status === 'approved' && req.isPickedUp) {
            return <Badge bg="info">Ολοκληρώθηκε</Badge>;
        }

        if (req.status === 'approved' && req.noShowReported) {
            return <Badge bg="danger">Δεν Εμφανίστηκε</Badge>;
        }

        switch (req.status) {
            case 'pending': return <Badge bg="warning" text="dark">Σε Αναμονή</Badge>;
            case 'approved': return <Badge bg="success">Έγινε Αποδοχή!</Badge>;
            case 'rejected': return <Badge bg="danger">Απορρίφθηκε</Badge>;
            default: return <Badge bg="secondary">{req.status}</Badge>;
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
                                {outgoingRequests.map(req => {
                                    const currentRequestId = req._id || req.id;
                                    const isPickedUp = req.isPickedUp;
                                    const isRated = req.isRated;
                                    const noShowReported = req.noShowReported;

                                    return (
                                    <Col md={6} lg={4} key={currentRequestId} className="mb-4">
                                        <Card className="shadow-sm h-100">
                                            <Card.Body className="d-flex flex-column">
                                                <Card.Title>Αγγελία: {req.ad?.title}</Card.Title>
                                                <Card.Text>
                                                    <strong>Ζητήσατε:</strong> {req.portions} μερίδα/ες <br/>
                                                    <strong>Κατάσταση:</strong> {getStatusBadge(req)}
                                                </Card.Text>
                                                
                                                {req.status === 'approved' && (
                                                    <Alert variant="success" className="mt-auto mb-0">
                                                        <small>Οδηγίες: {req.ad?.pickupLocationDetails}</small>
                                                    </Alert>
                                                )}

                                                {/* Διορθωμένη λογική με καθαρά Ternary Operators */}
                                                {req.status === 'approved' && (
                                                    <div className="mt-2">
                                                        {noShowReported ? (
                                                            <Alert variant="danger" className="mb-0 text-center" style={{ fontSize: '0.85rem' }}>
                                                                Ο χρήστης δεν εμφανίστηκε και έχει επιβληθεί ποινή.
                                                            </Alert>
                                                        ) : isPickedUp ? (
                                                            !isRated ? (
                                                                <Button 
                                                                    variant="warning" 
                                                                    className="w-100 fw-bold text-dark"
                                                                    onClick={() => handleOpenRatingModal(currentRequestId)}
                                                                >
                                                                    Δημιουργία Αξιολόγησης
                                                                </Button>
                                                            ) : (
                                                                <Alert variant="success" className="mb-0 text-center" style={{ fontSize: '0.85rem' }}>
                                                                    Έχετε ήδη αξιολογήσει αυτή την παραγγελία.
                                                                </Alert>
                                                            )
                                                        ) : (
                                                            <Alert variant="secondary" className="mb-0 text-center" style={{ fontSize: '0.85rem' }}>
                                                                Η δυνατότητα αξιολόγησης θα ξεκλειδωθεί μόλις ο δημιουργός επιβεβαιώσει την παραλαβή.
                                                            </Alert>
                                                        )}
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    ); // Προστέθηκε το κλείσιμο του return που έλειπε
                                })}
                            </Row>
                        )}
                    </Tab>
                </Tabs>
            )}

            {/* Ενσωμάτωση του Modal που απουσίαζε από το αρχείο σου */}
            <Modal show={showRatingModal} onHide={handleCloseRatingModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Αξιολόγηση Παραγγελίας</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <p className="mb-2">Πώς θα βαθμολογούσατε την εμπειρία σας;</p>
                    <div style={{ fontSize: '2.5rem', cursor: 'pointer', userSelect: 'none' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <span
                                key={star}
                                onClick={() => setRatingData({ ...ratingData, ratingScore: star })}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(0)}
                                style={{ 
                                    color: star <= (hoveredStar || ratingData.ratingScore) ? '#ffc107' : '#e4e5e9',
                                    transition: 'color 0.2s'
                                }}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseRatingModal}>
                        Ακύρωση
                    </Button>
                    <Button variant="primary" onClick={handleSubmitRating}>
                        Υποβολή Βαθμολογίας
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Requests;