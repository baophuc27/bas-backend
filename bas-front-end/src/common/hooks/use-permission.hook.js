import { useSelector } from "react-redux";

export const usePermission = () => {
  const userPermissions = useSelector((state) => state?.user?.permissions);

  // Ensure userPermissions is converted to an array of permissions
  const parsedPermissions = userPermissions ? userPermissions.split(",") : [];

  const hasPermission = (feature, action = "") => {
    if (action !== "") {
      // Check for specific permission with feature and action
      return parsedPermissions.includes(`${feature}_${action}`);
    } else {
      // Check for any permission that starts with the feature
      return parsedPermissions.some((permission) =>
        permission.startsWith(`${feature}`)
      );
    }
  };

  return {
    hasPermission,
  };
};
