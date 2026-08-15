import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Ads from './pages/Ads';

function App() {
  return (
    // Το BrowserRouter "αγκαλιάζει" όλη την εφαρμογή για να λειτουργεί το routing
    <BrowserRouter>
      
      {/* Ένα απλό μενού πλοήγησης που θα φαίνεται σε ΟΛΕΣ τις σελίδες */}
      <nav style={{ padding: '20px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
        {/* ΠΡΟΣΟΧΗ: Χρησιμοποιούμε <Link> και ΟΧΙ <a> για να μην κάνει refresh η σελίδα! */}
        <Link to="/login" style={{ marginRight: '15px' }}>Σύνδεση</Link>
        <Link to="/ads">Αγγελίες</Link>
      </nav>

      {/* Εδώ μέσα "ζουν" οι σελίδες μας. Ανάλογα το URL, φορτώνει το σωστό Element */}
      <Routes>
        {/* Όταν ο χρήστης πάει στο /login, δείξε το Component <Login /> */}
        <Route path="/login" element={<Login />} />
        
        {/* Όταν ο χρήστης πάει στο /ads, δείξε το Component <Ads /> */}
        <Route path="/ads" element={<Ads />} />
        
        {/* Μια προεπιλεγμένη σελίδα για όταν κάποιος μπαίνει στο σκέτο '/' */}
        <Route path="/" element={<h2>Καλώς ήρθες στην εφαρμογή μας! Επιλέξτε κάτι από το μενού.</h2>} />
        
        {/* Αν βάλει άκυρο URL, του δείχνουμε ένα 404 */}
        <Route path="*" element={<h2>404 - Η σελίδα δεν βρέθηκε! 😢</h2>} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;