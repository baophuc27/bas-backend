import { Box, CircularProgress } from "@material-ui/core";
import { useEffect } from "react";

/** This is a temp page for directing, the login flow was processed by handleRedirectPromise (MSAL) **/
export const RedirectPage = () => {
  useEffect(() => {
    setTimeout(() => window.location.replace("/"), 10000);
  }, []);

  return (
    <Box
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
      }}
    >
      <CircularProgress color="primary" style={{ margin: "auto" }} />
    </Box>
  );
};
