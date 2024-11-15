import { useMediaPredicate } from "react-media-hook";
import classes from "./mobile-view.style.module.css";

export const MobileView = ({ children, AppBar }) => {
  const isMobileScreen = useMediaPredicate("(max-width: 768px)");
  // const userAgent = navigator.userAgent.toLowerCase();
  // const isTablet = tabletRegExp.test(userAgent);

  // if (!isMobileScreen && !isTablet) {
  //   return null;
  // }

  if (!isMobileScreen) {
    return null;
  }

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        {AppBar}

        <div className={classes.body} style={{ paddingTop: AppBar ? 70 : 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
};
