// AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;