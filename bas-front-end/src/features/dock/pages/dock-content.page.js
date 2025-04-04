import { Box, Button, Divider, IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import StopIcon from "@material-ui/icons/Stop";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { AuthCheck, ProfileInformation } from "common/components";
import {
  BERTH_STATUS,
  BERTH_STATUS_COLOR,
  mapSensorStatusText,
  mapSensorVisualization,
} from "common/constants/berth.constant";
import { FEATURES } from "common/constants/feature.constant";
import { ACTIONS } from "common/constants/permission.constant";
import { tabletRegExp } from "common/constants/regex.constant";
import { usePermission, useScreenSize } from "common/hooks";
import { BerthService } from "common/services";
import { notify } from "common/utils/dashboard-toast.util";
import i18next from "i18next";
import { isEmpty } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import {
  setCurrentErrorDialog,
  setCurrentSessionCompleteDialog,
  resetErrorDialog,
  resetSessionCompleteDialog,
} from "redux/slices/dialog.slice";
import swal from "sweetalert";
import {
  AlarmHistoryTable,
  Hud,
  // OptimizedAlarmHistoryTable,
  VisualizationButtons,
  VisualizationV2,
  Widget,
} from "../components";
import { BerthWidget } from "../components/berth-widget.component";
import Compass from "../components/compass.component";
import { SidebarMainContainer } from "../components/sidebar-main-container.component";
import { NORMAL_STATUS_ID } from "../constants/alarm-status";
import { useAlarmHistoryData } from "../hooks";
import { AlarmHistoryOptimizedTable } from "./alarm-history-optimized-table";
import styles from "./dock.style.module.css";

const BUTTONS_RIGHT_MARGIN = 76;
const SIDEBAR_WIDTH = 320;

const DialogType = {
  DEVICE_ERROR: "DEVICE_ERROR",
  COMPLETED_SESSION: "COMPLETED_SESSION",
};

export const DockPageContent = ({
  id,
  socket,
  berth: berthData,
  setShowsBerthingSettings,
  showsBerthingSettings,
  setShowsDetailSettings,
  setShowsAlarmSetting,
  optimized = false,
  pastData,
  hasPastData,
  portsSocket,
  reload,
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [sensorAData, setSensorAData] = useState({
    speed: 0,
    distance: 0,
  });
  const [sensorBData, setSensorBData] = useState({
    speed: 0,
    distance: 0,
  });
  const [angleData, setAngleData] = useState({
    value: 0,
  });
  const [latestData, setLatestData] = useState({});
  const [sensorAId, setSensorAId] = useState();
  const [sensorBId, setSensorBId] = useState();
  const userAgent = navigator.userAgent.toLowerCase();
  const isTablet = tabletRegExp.test(userAgent);
  const [zoom, setZoom] = useState(isTablet ? 0.4 : 0.3);
  const { height: screenHeight, width: screenWidth } = useScreenSize();
  const [gettingRTData, setGettingRTData] = useState(false);
  const [stopPopupShown, setStopPopupShown] = useState(false);
  const [showsFinishSession, setShowFinishSession] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { hasPermission } = usePermission();
  const [myNewData, setMyNewData] = useState({});
  const { realtimeData, hasRealtimeData } = useAlarmHistoryData({
    sensorAId: Number(sensorAId),
    sensorBId: Number(sensorBId),
    latestData,
    sensorAToFender: berthData?.distanceToLeft,
    sensorBToFender: berthData?.distanceToRight,
  });
  const [sensorErrors, setSensorErrors] = useState({});
  const { errorDialogs, sessionCompleteDialogs } = useSelector(
    (state) => state?.dialog,
  );
  const dispatch = useDispatch();
  const berthFormValues = useSelector((state) => state.berth.berthFormValues);
  const onBack = () => navigate("/");

  const clearPortsSocket = () => {
    if (portsSocket) {
      portsSocket.off(`${DialogType.DEVICE_ERROR}`);
      portsSocket.off(`${DialogType.COMPLETED_SESSION}`);
    }
  };
  const onFinishSession = async (berthId) => {
    try {
      const response = await BerthService.finishSession(berthId);

      console.log("berth form values", berthFormValues);
      if (response?.data?.success) {
        notify("success", t("dock:messages.stop-success"));

        const newValues = {
          ...berthFormValues,
          currentStatus: "MOORING",
          upcomingStatus: "",
        };

        await BerthService.updateConfig(berthId, {
          status:
            BERTH_STATUS[newValues.upcomingStatus || newValues.currentStatus],
          distanceToLeft: newValues.leftSensorDistance,
          distanceToRight: newValues.rightSensorDistance,
          vessel: {
            code: newValues.vesselIMO,
            name: newValues.vesselName,
            flag: newValues.vesselFlag,
            length: newValues.vesselLength,
            beam: newValues.vesselBeam,
          },
          vesselDirection: !!newValues.vesselDirection,
        });
      }
    } catch (error) {
      notify("error", t("dock:messages.stop-error"));
    } finally {
      navigate(`/`);
    }
  };
  const onResetSession = async (berthId) => {
    try {
      const response = await BerthService.reset(berthId);

      if (response?.data?.success) {
        notify("success", t("dock:messages.stop-success"));
        // if (response?.data?.data?.isSync === true) {
        //   notify("success", t("dock:messages.sync-success"));
        // } else {
        //   notify("error", t("dock:messages.sync-error"));
        // }
      }

      clearPortsSocket();
    } catch (error) {
      notify("error", t("dock:messages.stop-error"));
    } finally {
      navigate("/");
    }
  };

  const triggerStopRecording = () => {
    const buttons = {
      cancel: t("dock:dialogs.stop-recording.cancel"),
      available: {
        text: t("dock:dialogs.stop-recording.available"),
        value: "available",
      },
    };

    // departing will not show mooring button
    if (berthData?.status?.id !== BERTH_STATUS.DEPARTING) {
      buttons.mooring = {
        text: t("dock:dialogs.stop-recording.mooring"),
        value: "mooring",
      };
    }

    swal({
      title: t("dock:dialogs.stop-recording.title"),
      text: t("dock:dialogs.stop-recording.message"),
      icon: "warning",
      buttons: buttons,
      showCloseButton: true,
    }).then((value) => {
      switch (value) {
        case "available":
          onResetSession(id);
          break;

        case "mooring":
          onFinishSession(id);
          break;

        default:
          break;
      }
    });
  };

  // const triggerFinishSession = () => {
  //   if (showsFinishSession === false) {
  //     swal({
  //       title: t("dock:dialogs.session-completed.title"),
  //       text: t("dock:dialogs.session-completed.message"),
  //       icon: "info",
  //       buttons: {
  //         cancel: t("dock:dialogs.stop-recording.cancel"),
  //         available: {
  //           text: t("dock:dialogs.stop-recording.available"),
  //           value: "available",
  //         },
  //         mooring: {
  //           text: t("dock:dialogs.stop-recording.mooring"),
  //           value: "mooring",
  //         },
  //       },
  //       showCloseButton: true,
  //     }).then(async (value) => {
  //       switch (value) {
  //         case "available":
  //           onResetSession(id);
  //           break;

  //         case "mooring":
  //           onFinishSession(id);
  //           break;

  //         default:
  //           break;
  //       }
  //     });

  //     setShowFinishSession(true);
  //   }
  // };

  const onChangeBerthingSettings = () => {
    if (hasPermission(FEATURES.BERTH_DASHBOARD, ACTIONS.EDIT)) {
      setShowsBerthingSettings(true);
    }
  };

  const checkFullscreenPermission = () => {
    return (
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  };

  const openFullscreen = async () => {
    try {
      if (!checkFullscreenPermission()) {
        console.warn("Fullscreen not supported or permitted");
        return false;
      }

      const element = document.documentElement;

      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
      return true;
    } catch (error) {
      console.error("Error entering fullscreen:", error);
      return false;
    }
  };

  const closeFullscreen = async () => {
    try {
      if (
        !document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement &&
        !document.msFullscreenElement
      ) {
        return;
      }

      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
    } catch (error) {
      console.error("Error exiting fullscreen:", error);
    }
  };

  const onFullScreen = async () => {
    if (isFullScreen) {
      await closeFullscreen();
    } else {
      const success = await openFullscreen();
      if (!success) {
        setIsFullScreen(false);
      }
    }
  };

  const showsErrorDialog = async (data) => {
    let errorContent = `${t(
      mapSensorStatusText(data?.errorCode?.toLowerCase()),
    )}`;

    const errorCode = data?.errorCode;
    const berthId = `berth_${data?.berth?.id}_${data?.sessionId}`;

    // Only show if this specific error hasn't been shown yet
    if (!(berthId in errorDialogs)) {
      dispatch(
        setCurrentErrorDialog({
          berthId,
          errorCode,
        }),
      );

      try {
        await swal({
          title: t("home:dialogs.device-error.title"),
          text: errorContent,
          icon: "error",
          buttons: t("home:dialogs.device-error.ok"),
        });
      } finally {
        // Clear only this specific error from the state
        dispatch(
          setCurrentErrorDialog({
            berthId: null,
            errorCode: null,
          }),
        );
      }
    }
  };

  const showsCompleteSessionDialog = async (completeDialogs, data) => {
    if (berthData?.status?.id === BERTH_STATUS.AVAILABLE) {
      return;
    }

    const berthId = `berth_${data?.berth?.id}_${data?.sessionId}`;

    if (!(berthId in completeDialogs)) {
      dispatch(
        setCurrentSessionCompleteDialog({
          berthId,
        }),
      );

      const buttons = {
        cancel: t("dock:dialogs.stop-recording.cancel"),
        available: {
          text: t("dock:dialogs.stop-recording.available"),
          value: "available",
        },
      };

      // Only show mooring option if not in DEPARTING status
      if (berthData?.status?.id !== BERTH_STATUS.DEPARTING) {
        buttons.mooring = {
          text: t("dock:dialogs.stop-recording.mooring"),
          value: "mooring",
        };
      }

      const value = await swal({
        title: t("home:dialogs.session-completed.title"),
        text: t("dock:dialogs.session-completed.message"),
        icon: "info",
        buttons: buttons,
        showCloseButton: true,
      });
      portsSocket?.off("COMPLETED_SESSION");

      switch (value) {
        case "available":
          onResetSession(data?.berth?.id);
          break;

        case "mooring":
          onFinishSession(data?.berth?.id);
          break;

        default:
          break;
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (mainRef.current) {
        setDimensions({
          width: mainRef.current.clientWidth,
          height: mainRef.current.clientHeight,
        });
      }
    };

    const handleFullscreenChange = () => {
      const isInFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullScreen(isInFullscreen);
    };

    handleResize();

    // Resize Listener
    window.addEventListener("resize", handleResize);

    // Fullscreen Listeners
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange); // For Safari
    document.addEventListener("mozfullscreenchange", handleFullscreenChange); // For Firefox
    document.addEventListener("MSFullscreenChange", handleFullscreenChange); // For IE/Edge

    return () => {
      // Resize Listener
      window.removeEventListener("resize", handleResize);

      // Fullscreen Listeners
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange,
      );
    };
  }, []);

  useEffect(() => {
    if (isFullScreen) {
      openFullscreen();
    } else {
      closeFullscreen();
    }
  }, [isFullScreen]);

  useEffect(() => {
    if (!isEmpty(berthData)) {
      setSensorAId(berthData?.leftDevice?.id);
      setSensorBId(berthData?.rightDevice?.id);

      if (berthData?.status?.id === BERTH_STATUS.AVAILABLE) {
        setShowsBerthingSettings(true);
      }

      // if (berthData?.status?.id === BERTH_STATUS.MOORING) {
      //   setSensorAData({
      //     speed: 0,
      //     distance: 5,
      //     status_id: NORMAL_STATUS_ID,
      //     original_distance: 5,
      //   });

      //   setSensorBData({
      //     speed: 0,
      //     distance: 5,
      //     status_id: NORMAL_STATUS_ID,
      //     original_distance: 5,
      //   });

      //   setAngleData({
      //     value: 0,
      //     status_id: NORMAL_STATUS_ID,
      //   });
      // }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [berthData]);

  useEffect(() => {
    if (socket && !socket.connected) {
      socket.connect();
    }
    if (socket) {
      socket?.on("connect", () => {
        socket.emit(
          "join",
          JSON.stringify({
            berthId: id,
          }),
        );
        socket.on("data", (data) => {
          setLatestData(JSON.parse(data));
        });
      });
    }

    return () => {
      if (socket) {
        socket.emit(
          "leave",
          JSON.stringify({
            berthId: id,
          }),
        );
        socket.off("connect");
        socket.off("data");
        socket.disconnect();
        socket.close();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, socket]);

  const isShipVisible = useMemo(() => {
    // const isMooring = berthData?.status?.id === BERTH_STATUS.MOORING;

    // if (isMooring) {
    //   return true;
    // }

    const leftNoErrors = !("left_sensor" in sensorErrors);
    const leftWeakSignal = sensorErrors["left_sensor"] === "weak_signal";
    const leftWorking = leftNoErrors || leftWeakSignal;

    const rightNoErrors = !("right_sensor" in sensorErrors);
    const rightWeakSignal = sensorErrors["right_sensor"] === "weak_signal";
    const rightWorking = rightNoErrors || rightWeakSignal;

    const sensorsWorking = leftWorking && rightWorking;

    return gettingRTData && sensorsWorking;
  }, [berthData?.status?.id, gettingRTData, sensorErrors]);

  useEffect(() => {
    if (
      !isEmpty(latestData) &&
      berthData?.status?.id !== BERTH_STATUS.AVAILABLE
    ) {
      setGettingRTData(true);

      const _sensorError = mapSensorVisualization(latestData.error_code);
      const sensorAHasErrors = !!_sensorError?.left_sensor;
      const sensorBHasErrors = !!_sensorError?.right_sensor;
      setSensorErrors(_sensorError);

      if (!sensorAHasErrors) {
        const leftDistance = latestData?.distance?.[sensorAId]?.value;
        let leftSpeed = latestData?.speed?.[sensorAId]?.value;

        // Convert null speed to 0 if distance exists
        if (leftDistance != null && leftSpeed == null) {
          leftSpeed = 0;
        }

        setSensorAData({
          speed: leftSpeed,
          distance: leftDistance,
          distance_status_id: latestData?.distance?.[sensorAId]?.alarm,
          speed_status_id: latestData?.speed?.[sensorAId]?.alarm,
          original_distance: leftDistance,
        });
      }

      if (!sensorBHasErrors) {
        const rightDistance = latestData?.distance?.[sensorBId]?.value;
        let rightSpeed = latestData?.speed?.[sensorBId]?.value;

        // Convert null speed to 0 if distance exists
        if (rightDistance != null && rightSpeed == null) {
          rightSpeed = 0;
        }

        setSensorBData({
          speed: rightSpeed,
          distance: rightDistance,
          status_id: latestData?.distance?.[sensorBId]?.alarm,
          distance_status_id: latestData?.distance?.[sensorBId]?.alarm,
          speed_status_id: latestData?.speed?.[sensorBId]?.alarm,
          original_distance: rightDistance,
        });
      }

      if (!sensorAHasErrors && !sensorBHasErrors) {
        setAngleData({
          value: latestData?.angle?.value,
          status_id: latestData?.angle?.alarm,
        });
      }
    } else {
      setGettingRTData(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestData]);
  useEffect(() => {
    if (!portsSocket) return;

    let currentErrors = new Set();

    const handleCompletedSession = (data) => {
      try {
        const parsedData = JSON.parse(data);
        showsCompleteSessionDialog(sessionCompleteDialogs, parsedData);
      } catch (error) {
        console.error("Error handling completed session:", error);
      }
    };
    const handleDeviceError = (data) => {
      try {
        const parsedData = JSON.parse(data);
        const errorKey = `${parsedData?.berth?.id}_${parsedData?.sessionId}_${parsedData?.errorCode}`;

        // Only show error if we haven't shown it yet
        if (!currentErrors.has(errorKey)) {
          currentErrors.add(errorKey);
          showsErrorDialog(parsedData);
        }
      } catch (error) {
        console.error("Error handling device error:", error);
      }
    };

    portsSocket.on("COMPLETED_SESSION", handleCompletedSession);
    portsSocket.on("DEVICE_ERROR", handleDeviceError);

    const handleConnect = () => {
      portsSocket.emit("join", JSON.stringify({ berthId: id }));
    };
    portsSocket.on("connect", handleConnect);

    if (portsSocket.connected) {
      handleConnect();
    }

    return () => {
      currentErrors.clear();
      portsSocket.off("COMPLETED_SESSION", handleCompletedSession);
      portsSocket.off("DEVICE_ERROR", handleDeviceError);
      portsSocket.off("connect", handleConnect);
    };
  }, [portsSocket, id]);

  useEffect(() => {
    return () => {
      // Clear dialogs when component unmounts
      dispatch(resetErrorDialog());
      dispatch(resetSessionCompleteDialog());
    };
  }, [dispatch]);

  if (
    berthData?.status?.id === BERTH_STATUS.AVAILABLE &&
    !hasPermission(FEATURES.BERTH_DASHBOARD, ACTIONS.EDIT)
  ) {
    notify("error", t("port-dashboard:messages.not-configured-berth"));

    return <Navigate to="/" />;
  }

  return (
    <AuthCheck>
      <Box
        className={styles.container}
        style={{
          gridTemplateColumns: isFullScreen
            ? "1fr"
            : isSidebarOpen
              ? `1fr ${SIDEBAR_WIDTH}px`
              : "1fr 0px",
        }}
      >
        <Box className={styles.main} ref={mainRef}>
          <VisualizationV2
            width={
              isFullScreen
                ? screenWidth
                : isSidebarOpen
                  ? screenWidth - SIDEBAR_WIDTH
                  : screenWidth - 0
            }
            height={screenHeight}
            sensorAData={sensorAData}
            sensorBData={sensorBData}
            // angle={angle}
            limitZone1={berthData?.limitZone1}
            limitZone2={berthData?.limitZone2}
            limitZone3={berthData?.limitZone3}
            // distanceToFender={berthData?.distanceToFender}
            sensorsDistance={berthData?.distanceDevice}
            // distanceToLeft={berthData?.distanceToLeft}
            distanceToFender={4}
            distanceToLeft={berthData?.distanceFender}
            // distanceToRight={berthData?.distanceToRight}
            zoom={zoom}
            // isMooring={berthData?.status?.id === BERTH_STATUS.MOORING}
            gettingRTData={gettingRTData}
            sensorAHasErrors={sensorErrors?.left_sensor}
            sensorBHasErrors={sensorErrors?.right_sensor}
            shipDirection={
              berthData?.vesselDirection === true ? "right" : "left"
            }
            sensorErrors={sensorErrors}
            isShipVisible={isShipVisible}
            sidebarCollapsed={!isSidebarOpen}
          />

          <Compass direction={berthData.directionCompass} />

          <Box className={styles.generalInfo}>
            <Box className={styles.generalInfoMain}>
              <Box className={styles.buttonContainer}>
                <IconButton aria-label="Back" onClick={onBack} disableRipple>
                  <ArrowBackIcon />
                </IconButton>
              </Box>

              <Box className={styles.generalInfoDetails}>
                <Box>
                  <Box
                    className={styles.status}
                    style={{
                      background: BERTH_STATUS_COLOR[berthData?.status?.id],
                    }}
                    onClick={onChangeBerthingSettings}
                  >
                    {i18next.language.includes("en")
                      ? berthData?.status?.nameEn
                      : berthData?.status?.name}
                  </Box>

                  <Box className={styles.dockName}>{berthData?.name}</Box>

                  <Box className={styles.shipName}>
                    {berthData?.currentVessel?.nameEn}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Hud
            hasData={
              berthData?.status?.id !== BERTH_STATUS.AVAILABLE && gettingRTData
            }
            sensorAData={sensorAData}
            sensorBData={sensorBData}
            angleData={angleData}
            sensorA={berthData?.leftDevice}
            sensorB={berthData?.rightDevice}
            sensorAHasErrors={sensorErrors?.left_sensor}
            sensorBHasErrors={sensorErrors?.right_sensor}
          />
        </Box>

        {!isFullScreen && (
          <Box className={styles.sideBar} style={{ position: "relative" }}>
            <IconButton
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ position: "absolute", left: -40, top: screenHeight / 2 }}
            >
              {isSidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
            {isSidebarOpen && (
              <>
                <Box>
                  <ProfileInformation />

                  <Divider />
                </Box>

                <SidebarMainContainer screenHeight={screenHeight}>
                  <Box p={2}>
                    <Widget />
                  </Box>

                  <Box>
                    <BerthWidget berthData={berthData} />
                  </Box>

                  {berthData?.status?.id === 2 && (
                    <>
                      <Divider />

                      {true ? (
                        <AlarmHistoryOptimizedTable
                          onClickSettings={() => setShowsAlarmSetting(true)}
                          pastData={pastData}
                          hasPastData={hasPastData}
                          realtimeData={realtimeData}
                          hasRealtimeData={hasRealtimeData}
                          sensorAToFender={berthData?.distanceToLeft || 0}
                          sensorBToFender={berthData?.distanceToRight || 0}
                        />
                      ) : (
                        <AlarmHistoryTable
                          berthId={berthData?.id}
                          berthStatus={berthData?.status?.id}
                          hasData={gettingRTData}
                          latestData={latestData}
                          onClickSettings={() => setShowsAlarmSetting(true)}
                          sensorAId={berthData?.leftDevice?.id}
                          sensorBId={berthData?.rightDevice?.id}
                          sensorAToFender={berthData?.distanceToLeft || 0}
                          sensorBToFender={berthData?.distanceToRight || 0}
                        />
                      )}
                    </>
                  )}
                </SidebarMainContainer>

                {berthData?.status?.id !== BERTH_STATUS.AVAILABLE &&
                  berthData?.status?.id !== BERTH_STATUS.MOORING &&
                  hasPermission(FEATURES.BERTH_DASHBOARD, ACTIONS.EDIT) && (
                    <Box mt="auto">
                      <Divider />

                      <Box p={2}>
                        <Button
                          onClick={triggerStopRecording}
                          className="custom-danger-button"
                          style={{ width: "100%" }}
                        >
                          <StopIcon size="small" style={{ color: "white" }} />
                          <span>{t("dock:stop-recording")}</span>
                        </Button>
                      </Box>
                    </Box>
                  )}
              </>
            )}
          </Box>
        )}

        {/* {hasPermission(FEATURES.BERTH_DASHBOARD, ACTIONS.EDIT) && ( */}
        <VisualizationButtons
          zoom={zoom}
          onZoom={setZoom}
          left={
            isFullScreen || !isSidebarOpen
              ? screenWidth - BUTTONS_RIGHT_MARGIN
              : screenWidth - BUTTONS_RIGHT_MARGIN - SIDEBAR_WIDTH
          }
          bottom={150}
          onClickSettings={() => setShowsDetailSettings(true)}
          onFullScreen={onFullScreen}
          isFullScreen={isFullScreen}
        />
        {/* )} */}
      </Box>
    </AuthCheck>
  );
};
