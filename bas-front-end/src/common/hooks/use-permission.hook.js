import { useSelector } from "react-redux";

export const usePermission = () => {
  const userPermissions = useSelector((state) => state?.user?.permissions);

  const hasPermission = (feature, action = "") => {
    if (action !== "") {
      return userPermissions?.includes(`${feature}_${action}`);
    } else {
      return userPermissions?.some((permission) =>
        permission?.startsWith(`${feature}`),
      );
    }
  };

  return {
    hasPermission,
  };
};
