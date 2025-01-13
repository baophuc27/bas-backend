import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SESSION_DURATION } from "../../redux/store";

export const usePermission = () => {
  const userPermissions = useSelector((state) => state?.user?.permissions);

  const isValidString = typeof userPermissions === "string";
  const parsedPermissions = isValidString
    ? userPermissions.split(",")
    : [];
  const navigate = useNavigate();

  useEffect(() => {
    if (!parsedPermissions.length) {
      alert("Your session has ended. Please login again.");
      navigate("/auth/login");
      return;
    }
    // Compare current time with the session start time from Redux
    const sessionStart = Date.now(); // e.g., from state?.user?.sessionStart
    if (Date.now() - sessionStart > SESSION_DURATION) {
      alert("Your session has timed out. Please login again.");
      navigate("/auth/login");
    }
  }, [parsedPermissions, navigate]);

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
