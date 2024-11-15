import { useMediaPredicate } from "react-media-hook";

export const DesktopView = ({ children }) => {
  const isDesktopScreen = useMediaPredicate("(min-width: 769px)");
  // const userAgent = navigator.userAgent.toLowerCase();
  // const isTablet = tabletRegExp.test(userAgent);

  return isDesktopScreen ? children : null;
};
