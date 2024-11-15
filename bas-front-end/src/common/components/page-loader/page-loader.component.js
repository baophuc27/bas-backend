import { LinearProgress } from "@material-ui/core";
import { styled } from "@material-ui/styles";

const LoaderWrapper = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 99,
  width: "100vw",
});

export const PageLoader = (props) => (
  <LoaderWrapper>
    <LinearProgress color="primary" />
  </LoaderWrapper>
);
