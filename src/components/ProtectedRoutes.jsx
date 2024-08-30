import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthenticateContext } from "../Context";

const ProtectedRoutes = () => {
    const { auth } = useContext(AuthenticateContext);

    return auth ? (
        <Outlet />
    ) : (
        <Navigate to="/" replace state={{ protectedRoutes: true }} />
    );
};

export default ProtectedRoutes;