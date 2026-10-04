// AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    // Παράδειγμα: Διαβάζεις τα στοιχεία του χρήστη από το Context, το Redux, ή το sessionStorage
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user || user.role !== 'admin') {
        // Αν δεν είναι admin, τον διώχνεις στην αρχική
        return <Navigate to="/" replace />;
    }

    // Αν είναι admin, τον αφήνεις να δει τη σελίδα (Outlet)
    return <Outlet />;
};

export default AdminRoute;