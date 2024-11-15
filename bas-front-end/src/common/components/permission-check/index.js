import { usePermission } from "common/hooks";
import { Navigate } from "react-router-dom";

export const PagePermissionCheck = ({
  feature,
  children,
  redirectTo = "/auth/login",
}) => {
  const { hasPermission } = usePermission();

  if (hasPermission(feature)) {
    return children;
  }

  return <Navigate to={redirectTo} replace />;
};
