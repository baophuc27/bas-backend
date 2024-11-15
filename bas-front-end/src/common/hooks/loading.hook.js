import { useState } from "react";

export const useLoading = () => {
  const [loading, setLoading] = useState(false);

  const enabledLoading = () => {
    setLoading(true);
  };

  const disabledLoading = () => {
    setTimeout(() => setLoading(false), 500);
  };

  return [loading, enabledLoading, disabledLoading];
};
