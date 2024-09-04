import { Navigate, Outlet } from 'react-router-dom';


const ProtectedRoutes = () => {

    return localStorage.getItem('auth') ? (
        <Outlet />
    ) : (
        <Navigate to="/" replace state={{ protectedRoutes: true }} />
    );
};

export default ProtectedRoutes;