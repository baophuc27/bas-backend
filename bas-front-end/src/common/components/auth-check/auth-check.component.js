import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const AuthCheck = ({ children, featureName, featurePermission }) => {
  const { isLoggedIn } = useSelector((state) => state?.user);

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};
