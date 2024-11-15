import { Box, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import compassPointer from "assets/images/compass-pointer.svg";
import globeActive from "assets/images/globe-active.svg";
import globe from "assets/images/globe.svg";
import classes from "./mobile-map-buttons.style.module.css";

const useStyles = makeStyles((theme) => ({
  zoomButton: {
    backgroundColor: "#FFFFFF",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
    borderRadius: "50px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  zoomButtonChild: {
    borderRadius: 0,
    height: 42,
  },
  buttonContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: "50px",
    overflow: "hidden",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
  },
}));

export const MobileMapButtons = ({
  degree = 0,
  showsMapLines = false,
  onResetCompass = () => {},
  onToggleMapLines = () => {},
}) => {
  const muiClasses = useStyles();

  return (
    <div className={classes.container}>
      <Box className={muiClasses.buttonContainer}>
        <IconButton onClick={onResetCompass} disableRipple>
          <img
            src={compassPointer}
            alt="Compass"
            className={classes.compassPointer}
            style={{
              transform: `scale(1.4) rotate(${degree}deg)`,
            }}
          />
        </IconButton>
      </Box>
      <Box className={muiClasses.buttonContainer}>
        <IconButton
          disableRipple
          onClick={onToggleMapLines}
          style={{
            backgroundColor: showsMapLines ? "#3699FF" : "white",
          }}
        >
          <img
            src={showsMapLines ? globeActive : globe}
            alt="Show map lines"
            className={classes.globeIcon}
          />
        </IconButton>
      </Box>
    </div>
  );
};
