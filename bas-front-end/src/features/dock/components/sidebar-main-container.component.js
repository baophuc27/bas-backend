import { Box } from "@material-ui/core";

const TABLET_HEIGHT = 600;

export const SidebarMainContainer = ({ children, screenHeight }) => {
  // if (screenHeight > TABLET_HEIGHT) {
  //   return children;
  // }

  return (
    <Box flex={1} style={{ overflowY: "auto" }}>
      {children}
    </Box>
  );
};
