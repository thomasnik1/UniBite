import { useContext, useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// Εισάγουμε τα έτοιμα κομμάτια του Bootstrap
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import logoImg from '../assets/images/unibite.png';
import api from '../services/api';

function Layout() {
    const { token, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const isLoggedIn = !!token;
    const [pendingRequests, setPendingRequests] = useState(0);
    const [username, setUsername] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/');
    };
// 1. Ελέγχουμε το Backend για νέα αιτήματα μόλις φορτώσει το Navbar
    useEffect(() => {
        const fetchUnreadRequests = async () => {
            try {
                // ΠΡΟΣΟΧΗ: Θα χρειαστείς ένα endpoint στο backend που επιστρέφει
                // τον αριθμό (count) των εκκρεμών αιτημάτων για τον συνδεδεμένο χρήστη.
                const response = await api.get('/requests/pending-count');
                
                // Υποθέτοντας ότι το backend επιστρέφει κάτι σαν { count: 3 }
                setPendingRequests(response.data.count); 
            } catch (error) {
                console.error("Δεν μπορέσαμε να φορτώσουμε τις ειδοποιήσεις:", error);
            }
        };

        // Ρωτάμε το backend ΜΟΝΟ αν ο χρήστης είναι συνδεδεμένος (αν υπάρχει token)
        const token = localStorage.getItem('token');
        if (token) {
            fetchUnreadRequests();
        }

        const storedUsername = localStorage.getItem('username');
            if (storedUsername) {
                setUsername(storedUsername);
            }
    }, [isLoggedIn]);

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Το έτοιμο Navbar του Bootstrap. Το bg="dark" το κάνει μαύρο! */}
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
                <Container>
                    <img 
                        src={logoImg}
                        alts="UniBite Logo"
                        width="180"
                        height="60"
                    />
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">

                            {isLoggedIn ? (
                                /* ----- ΤΙ ΒΛΕΠΕΙ Ο ΣΥΝΔΕΔΕΜΕΝΟΣ ΧΡΗΣΤΗΣ ----- */
                                <>
                                    <Nav.Link as={Link} to="/ads">Αγγελίες</Nav.Link>
                                    <Nav.Link as={Link} to="/ads/create">Νέα Αγγελία</Nav.Link>
                                    <Nav.Link as={Link} to="/ads/my-ads">Οι Αγγελίες Μου</Nav.Link>
                                    <Nav.Link as={Link} to="/requests/show" className="position-relative">
                                        Αιτήματα
                                        {pendingRequests > 0 && (
                                            <Badge pill bg="danger" className="ms-1">
                                                {pendingRequests}
                                            </Badge>
                                        )}
                                    </Nav.Link>

                                    {/* Το Όνομα του Χρήστη και το ΜΟΝΑΔΙΚΟ Κουμπί Αποσύνδεσης */}
                                    <div className="d-flex align-items-center ms-lg-4 mt-2 mt-lg-0">
                                        {username && (
                                            <Navbar.Text className="me-3 text-white">
                                                Γεια σου, <strong>{username}</strong>!
                                            </Navbar.Text>
                                        )}
                                        <Button 
                                            variant="outline-light" 
                                            size="sm" 
                                            onClick={handleLogout}
                                        >
                                            Αποσύνδεση
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                /* ----- ΤΙ ΒΛΕΠΕΙ Ο ΕΠΙΣΚΕΠΤΗΣ ----- */
                                // ... (το κομμάτι αυτό παραμένει ίδιο με τα Login / Register)
                                /* ----- ΤΙ ΒΛΕΠΕΙ Ο ΕΠΙΣΚΕΠΤΗΣ ----- */
                                <>
                                    <Nav.Link as={Link} to="/login">Σύνδεση</Nav.Link>
                                    <Nav.Link as={Link} to="/create">Εγγραφή</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Το Outlet είναι η "τρύπα" όπου μπαίνουν οι σελίδες */}
            <Container className="flex-grow-1">
                <Outlet />
            </Container>

            {/* Το Footer χρησιμοποιεί κλάσεις Bootstrap όπως bg-light, text-center */}
            <footer className="bg-light text-center py-3 mt-auto">
                <Container>
                    <p className="mb-0">© {new Date().getFullYear()} UniBite App.</p>
                </Container>
            </footer>
        </div>
    );
}

export default Layout;