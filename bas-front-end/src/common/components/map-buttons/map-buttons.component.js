import { Box, Divider, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import compassPointer from "assets/images/compass-pointer.svg";
import fullScreen from "assets/images/full-screen.svg";
import globeActive from "assets/images/globe-active.svg";
import globe from "assets/images/globe.svg";
import zoomIn from "assets/images/zoom-in.svg";
import zoomOut from "assets/images/zoom-out.svg";
import classes from "./map-buttons.style.module.css";

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

export const MapButtons = ({
  isMap = true,
  degree = 0,
  showsMapLines = false,
  onZoomIn = () => {},
  onZoomOut = () => {},
  onZoomToFit = () => {},
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
          onClick={onToggleMapLines}
          style={{
            backgroundColor: showsMapLines ? "#3699FF" : "white",
          }}
          disableRipple
        >
          <img
            src={showsMapLines ? globeActive : globe}
            alt="Show map lines"
            className={classes.globeIcon}
          />
        </IconButton>
      </Box>
      {isMap && (
        <>
          <Box className={muiClasses.zoomButton}>
            <IconButton
              className={muiClasses.zoomButtonChild}
              onClick={onZoomIn}
              disableRipple
            >
              <img src={zoomIn} alt="Zoom In" />
            </IconButton>

            <Divider />

            <IconButton
              className={muiClasses.zoomButtonChild}
              onClick={onZoomOut}
              disableRipple
            >
              <img src={zoomOut} alt="Zoom Out" />
            </IconButton>
          </Box>

          <Box className={muiClasses.buttonContainer}>
            <IconButton onClick={onZoomToFit} disableRipple>
              <img src={fullScreen} alt="Zoom To Fit" />
            </IconButton>
          </Box>
        </>
      )}
    </div>
  );
};
