import { useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// Εισάγουμε τα έτοιμα κομμάτια του Bootstrap
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import logoImg from '../assets/images/unibite.png';

function Layout() {
    const { token, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const isLoggedIn = !!token;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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
                                    <Button 
                                        variant="outline-light" 
                                        size="sm" 
                                        className="ms-3" 
                                        onClick={handleLogout}
                                    >
                                        Αποσύνδεση
                                    </Button>
                                </>
                            ) : (
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