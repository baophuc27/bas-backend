import { Box, CircularProgress, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ReplayIcon from "@material-ui/icons/Replay";
import moment from "moment";
import { useTranslation } from "react-i18next";
import styles from "./player-toolbar.style.module.css";

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    margin: "0 6px",
    padding: 14,
  },
  speedRateButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    margin: "0 6px",
    padding: `12px 14px`,
  },
}));

export const PlayerToolbar = ({
  isPlaying = false,
  currentTime = "",
  endTime = "",
  speedRate = 2,
  onPlay = () => {},
  onReplay = () => {},
  onSpeed = () => {},
  currentIndex = 0,
  lastIndex = 0,
  isLoadingChunk = false,
}) => {
  const { t } = useTranslation();
  const muiClasses = useStyles();

  if (currentTime === "") {
    return null;
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.mainContainer}>
        <IconButton
          className={muiClasses.button}
          onClick={onPlay}
          disableRipple
          disabled={isLoadingChunk || currentIndex === lastIndex}
        >
          {isPlaying ? (
            <PauseIcon style={{ fontSize: 24 }} />
          ) : (
            <PlayArrowIcon style={{ fontSize: 24 }} />
          )}
        </IconButton>

        <IconButton
          className={muiClasses.button}
          onClick={onReplay}
          disableRipple
          disabled={isLoadingChunk || isPlaying || currentIndex === 0}
        >
          <ReplayIcon style={{ fontSize: 24 }} />
        </IconButton>

        <IconButton
          className={muiClasses.speedRateButton}
          onClick={onSpeed}
          disableRipple
          disabled={isLoadingChunk}
        >
          {speedRate}x
        </IconButton>

        {currentTime !== "" && endTime !== "" && (
          <Box mx={2}>
            <span>
              {moment(currentTime)?.format("DD/MM/YYYY HH:mm:ss:SSS")}
            </span>
            <span> - </span>
            <span>{moment(endTime)?.format("DD/MM/YYYY HH:mm:ss:SSS")}</span>
          </Box>
        )}
      </Box>

      {isLoadingChunk && (
        <Box
          display="flex"
          mt={2}
          mb={1}
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress
            color="inherit"
            size={16}
            style={{ marginRight: 12 }}
          />

          <p>{t("common:player.loading")}</p>
        </Box>
      )}
    </Box>
  );
};
