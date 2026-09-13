import { useContext, useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
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
    useEffect(() => {
        const fetchUnreadRequests = async () => {
            try {
                const response = await api.get('/requests/pending-count');
                
                setPendingRequests(response.data.count); 
            } catch (error) {
                console.error("Δεν μπορέσαμε να φορτώσουμε τις ειδοποιήσεις:", error);
            }
        };

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
                        {isLoggedIn ? (
                            <>
                                <Nav className="mx-auto align-items-center">
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
                                    <Nav.Link as={Link} to="/profile">Προφίλ</Nav.Link>
                                </Nav>

                                {/* ΤΕΡΜΑ ΔΕΞΙΑ (Username & Αποσύνδεση) */}
                                <div className="d-flex align-items-center ms-lg-auto mt-2 mt-lg-0">
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
                            <Nav className="mx-auto align-items-center">
                                <Nav.Link as={Link} to="/login">Σύνδεση</Nav.Link>
                                <Nav.Link as={Link} to="/create">Εγγραφή</Nav.Link>
                            </Nav>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="flex-grow-1">
                <Outlet />
            </Container>

            <footer className="bg-light text-center py-3 mt-auto">
                <Container>
                    <p className="mb-0">© {new Date().getFullYear()} UniBite App.</p>
                </Container>
            </footer>
        </div>
    );
}

export default Layout;