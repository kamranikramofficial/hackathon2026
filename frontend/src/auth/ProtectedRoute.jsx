import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'Admin') return <Navigate to="/admin" replace />;
        if (user.role === 'Doctor') return <Navigate to="/doctor" replace />;
        if (user.role === 'Receptionist') return <Navigate to="/receptionist" replace />;
        if (user.role === 'Patient') return <Navigate to="/patient" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
