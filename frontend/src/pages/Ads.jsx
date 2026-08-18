import { Container, Row, Col, Card, Button } from 'react-bootstrap';

function Ads() {
    return (
        <Container>
            <h2 className="mb-4">Διαθέσιμες Αγγελίες</h2>
            <Row>
                <Col md={4}>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <Card.Title>Μακαρόνια με Κιμά</Card.Title>
                            <Card.Text>2 Μερίδες • Κέντρο Αθήνας</Card.Text>
                            <Button variant="primary" className="w-100">Δες περισσότερα</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Ads;