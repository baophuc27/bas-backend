const { Box } = require("@material-ui/core");

export const LimitBox = ({ children, maxWidth }) => {
  return (
    <Box
      style={{
        display: "block",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: maxWidth || 100,
      }}
    >
      {children}
    </Box>
  );
};
