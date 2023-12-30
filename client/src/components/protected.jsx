import { Outlet, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    // You may show a loading spinner or some other UI while Auth0 is checking authentication status
    return <Spinner />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  } else {
    return <div>{children}</div>;
  }
};

export default ProtectedRoute;
