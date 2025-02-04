import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedAuthRoute = () => {
    const { user } = useContext(AuthContext);

    if (user) {
        return <Navigate to="/settings" />;
    }

    return <Outlet />;
};

export default ProtectedAuthRoute;
