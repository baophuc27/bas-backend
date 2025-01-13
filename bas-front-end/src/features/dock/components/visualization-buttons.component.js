import { Box, IconButton } from "@material-ui/core";
import CropFreeIcon from "@material-ui/icons/CropFree";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import styles from "./visualization-buttons.style.module.css";

const MAX_ZOOM = 1.8;
const MIN_ZOOM = 0.2;

export const VisualizationButtons = ({
  zoom = 1,
  onZoom = () => {},
  left = 0,
  bottom = 0,
  onClickSettings = () => {},
  onFullScreen = () => {},
  isFullScreen = false,
}) => {
  const handleZoomIn = () => {
    if (zoom + 0.1 <= MAX_ZOOM) {
      onZoom(zoom + 0.1);
    }
  };

  const handleZoomOut = () => {
    if (zoom - 0.1 >= MIN_ZOOM) {
      onZoom(zoom - 0.1);
    }
  };

  const handleFullScreen = () => {};

  return (
    <Box
      className={styles.container}
      style={{
        left,
        bottom,
      }}
    >
      <Box className={styles.buttonContainer}>
        <IconButton onClick={onFullScreen} disableRipple>
          {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Box>

      {/* <Box className={styles.zoomButtons}>
        <IconButton onClick={handleZoomIn} disabled={zoom + 0.1 > MAX_ZOOM}>
          <AddIcon />
        </IconButton>

        <IconButton onClick={handleZoomOut} disabled={zoom - 0.1 < MIN_ZOOM}>
          <RemoveIcon />
        </IconButton>
      </Box> */}
    </Box>
  );
};
