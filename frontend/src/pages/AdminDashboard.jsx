import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Table, Badge } from 'react-bootstrap';
import api from '../services/api';

function AdminDashboard() {
    const [stats, setStats] = useState({
        portionsLastMonth: 0,
        topDonor: null,
        topMeals: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [portionsRes, donorRes, mealsRes] = await Promise.all([
                    api.get('/admin/stats/portions-last-month'),
                    api.get('/admin/stats/top-donor'),
                    api.get('/admin/stats/top-meals')
                ]);

                setStats({
                    portionsLastMonth: portionsRes.data.totalPortions || 0,
                    topDonor: donorRes.data.topDonor || null,
                    topMeals: mealsRes.data.topMeals || []
                });
                
                setLoading(false);
            } catch (err) {
                console.error("Σφάλμα φόρτωσης στατιστικών:", err);
                if (err.response && err.response.status === 403) {
                    setError('Απαγορεύεται η πρόσβαση. Δεν έχετε δικαιώματα διαχειριστή.');
                } else {
                    setError('Αποτυχία φόρτωσης των δεδομένων του Dashboard.');
                }
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Φόρτωση δεδομένων διαχειριστή...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5 mb-5">
            <h2 className="mb-4 fw-bold">Dashboard Διαχειριστή</h2>

            <Row className="mb-5">
                <Col md={6} className="mb-3">
                    <Card className="shadow-sm border-0 bg-primary text-white h-100">
                        <Card.Body className="text-center d-flex flex-column justify-content-center">
                            <Card.Title className="fs-5 text-uppercase opacity-75">
                                Μερίδες (Τελευταίος Μήνας)
                            </Card.Title>
                            <Card.Text className="display-4 fw-bold mb-0">
                                {stats.portionsLastMonth}
                            </Card.Text>
                            <small className="mt-2 text-light">Ολοκληρωμένες παραλαβές</small>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} className="mb-3">
                    <Card className="shadow-sm border-0 bg-success text-white h-100">
                        <Card.Body className="text-center d-flex flex-column justify-content-center">
                            <Card.Title className="fs-5 text-uppercase opacity-75">
                                Κορυφαίος Δωρητής
                            </Card.Title>
                            {stats.topDonor ? (
                                <>
                                    <Card.Text className="display-5 fw-bold mb-0">
                                        {stats.topDonor['ad.cook.username'] || 'Άγνωστος'}
                                    </Card.Text>
                                    <small className="mt-2 text-light">
                                        Σύνολο Μερίδων: <strong>{stats.topDonor.totalDonated}</strong>
                                    </small>
                                </>
                            ) : (
                                <Card.Text className="fs-5 mt-2">Δεν βρέθηκαν επαρκή δεδομένα</Card.Text>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                    <h5 className="mb-0 fw-bold">Κορυφαία Γεύματα (Βάσει Αξιολογήσεων)</h5>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Τίτλος Αγγελίας</th>
                                <th>Βαθμολογία</th>
                                <th>Μερίδες</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.topMeals.length > 0 ? (
                                stats.topMeals.map((rating, index) => (
                                    <tr key={rating.id}>
                                        <td className="align-middle text-muted">{index + 1}</td>
                                        <td className="align-middle fw-bold">
                                            {rating.request?.ad?.title || 'Άγνωστη Αγγελία'}
                                        </td>
                                        <td className="align-middle">
                                            <Badge bg="warning" text="dark" className="fs-6">
                                                {rating.ratingScore} / 5 ★
                                            </Badge>
                                        </td>
                                        <td className="align-middle">
                                            {rating.request?.ad?.portions || '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-muted">
                                        Δεν υπάρχουν ακόμα αξιολογήσεις στο σύστημα.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AdminDashboard;