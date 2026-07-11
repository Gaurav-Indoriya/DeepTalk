import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {

    const user = JSON.parse(localStorage.getItem("user"));

    return user ? <Navigate to="/Home" replace /> : children;

};

export default PublicRoute;