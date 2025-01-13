import { Avatar, Box, Grid, IconButton, Tooltip } from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import { HomeLayout } from "common/components";
import { mapSensorStatusText } from "common/constants/berth.constant";
import {
  BerthService,
  HabourService,
  UserManagementService,
} from "common/services";
import { notify } from "common/utils/dashboard-toast.util";
import i18next from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentErrorDialog,
  setCurrentSessionCompleteDialog,
} from "redux/slices/dialog.slice";
import socketIOClient from "socket.io-client";
import swal from "sweetalert";
import { BerthCard } from "../components";
import styles from "./home.style.module.css";
import { usePermission } from "common/hooks";
import { FEATURES } from "common/constants/feature.constant";
import { ACTIONS } from "common/constants/permission.constant";
const DialogType = {
  DEVICE_ERROR: "DEVICE_ERROR",
  COMPLETED_SESSION: "COMPLETED_SESSION",
};

export const HomePage = (props) => {
  const { t, i18n } = useTranslation();
  const [berths, setBerths] = useState([]);
  const [habour, setHabour] = useState({});
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();
  const { errorDialogs, sessionCompleteDialogs } = useSelector(
    (state) => state?.dialog,
  );

  const fetchHabourData = async () => {
    try {
      const response = await HabourService.getData();

      if (response?.data?.success) {
        setHabour(response?.data?.data);
      }
    } catch (error) {}
  };

  const fetchBerths = async () => {
    try {
      const response = await BerthService.getAll();

      if (response?.data?.success) {
        setBerths(response?.data?.data);
      }
    } catch (error) {}
  };

  const initSocket = async () => {
    try {
      const resp = await UserManagementService.getSocketAccessToken();

      if (resp?.data?.success) {
        const newSocket = socketIOClient.io(
          `${process.env.REACT_APP_API_BASE_URL}/port-events`,
          {
            extraHeaders: {
              authorization: resp.data?.accessToken,
            },
          },
        );

        setSocket(newSocket);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishSession = async (id) => {
    try {
      const response = await BerthService.finishSession(id);

      if (response?.data?.success) {
        notify("success", t("dock:messages.stop-success"));

        // if (response?.data?.isSync === true) {
        //   notify("success", t("dock:messages.sync-success"));
        // } else {
        //   notify("error", t("dock:messages.sync-error"));
        // }
      }
    } catch (error) {
      notify("error", t("dock:messages.stop-error"));
    }
  };

  const onResetSession = async (id) => {
    try {
      const response = await BerthService.reset(id);

      if (response?.data?.success) {
        notify("success", t("dock:messages.stop-success"));

        // if (response?.data?.data?.isSync === true) {
        //   notify("success", t("dock:messages.sync-success"));
        // } else {
        //   notify("error", t("dock:messages.sync-error"));
        // }
      }
    } catch (error) {
      notify("error", t("dock:messages.stop-error"));
    }
  };

  const showsErrorDialog = async (data) => {
    // ${i18n?.language?.includes("en") ? data?.berth?.nameEn : data?.berth?.name}
    let errorContent = `[${data?.berth?.name}] ${t(
      mapSensorStatusText(data?.errorCode?.toLowerCase()),
    )}`;

    const errorCode = data?.errorCode;
    const berthId = `berth_${data?.berth?.id}_${data?.sessionId}`;

    // check if berth is available/mooring then return
    const find = berths?.find((berth) => berth?.id === data?.berth?.id);
    if (find?.status?.id === 0 || find?.status?.id === 1) {
      return;
    }

    if (!(berthId in errorDialogs) || errorDialogs?.[berthId] !== errorCode) {
      dispatch(
        setCurrentErrorDialog({
          berthId,
          errorCode,
        }),
      );

      await swal({
        title: t("home:dialogs.device-error.title"),
        text: errorContent,
        icon: "error",
        buttons: t("home:dialogs.device-error.ok"),
      });
    }
  };

  /**
   * Checks the status of a specific berth and prompts for confirmation if needed
   * @param {string|number} berthId - The ID of the berth to check
   * @returns {Promise<boolean>} - Returns true if berth is available or user confirms, false otherwise
   */
  const checkBerthStatus = async (berthId) => {
    try {
      const response = await BerthService.getAll();
      if (!response?.data?.success) {
        notify("error", t("common:messages.error"));
        return false;
      }

      const currentBerth = response.data.data?.find(
        (berth) => berth.id === berthId,
      );

      if (!currentBerth) {
        return false;
      }

      // check if berth is NOT available (0) or NOT mooring (1)
      if (currentBerth.status?.id !== 0 && currentBerth.status?.id !== 1) {
        const confirm = await swal({
          title: t("home:dialogs.status-warning.title"),
          text: t("home:dialogs.status-warning.message"),
          icon: "warning",
          buttons: {
            cancel: t("common:cancel"),
            confirm: {
              text: t("common:continue"),
              value: true,
            },
          },
        });
        return confirm;
      }
      return true;
    } catch (error) {
      notify("error", t("common:messages.error"));
      return false;
    }
  };
  const showsCompleteSessionDialog = async (completeDialogs, data) => {
    const berthId = `berth_${data?.berth?.id}_${data?.sessionId}`;

    if (
      !(berthId in completeDialogs) &&
      hasPermission(FEATURES.BERTH_DASHBOARD, ACTIONS.EDIT)
    ) {
      const canProceed = await checkBerthStatus(data?.berth?.id);
      if (!canProceed) return;

      dispatch(
        setCurrentSessionCompleteDialog({
          berthId,
        }),
      );

      const value = await swal({
        title: t("home:dialogs.session-completed.title"),
        text: t("home:dialogs.session-completed.message", {
          berthName: data?.berth?.name,
        }),
        icon: "info",
        buttons: {
          cancel: t("dock:dialogs.stop-recording.cancel"),
          available: {
            text: t("dock:dialogs.stop-recording.available"),
            value: "available",
          },
          mooring: {
            text: t("dock:dialogs.stop-recording.mooring"),
            value: "mooring",
          },
        },
        showCloseButton: true,
      });

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

  const cleanupSocket = (socket) => {
    if (socket) {
      socket.off("connect");
      socket.off(DialogType.DEVICE_ERROR);
      socket.off(DialogType.COMPLETED_SESSION);
      socket.disconnect();
      socket.close();
    }
  };

  const handleReload = () => {
    fetchBerths();
    fetchHabourData();
  };

  useEffect(() => {
    initSocket();
    fetchBerths();
    fetchHabourData();

    return () => {
      cleanupSocket(socket);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (socket) {
      socket?.on("connect", () => {
        socket.on(DialogType.DEVICE_ERROR, (data) => {
          const parsedData = JSON.parse(data);
          showsErrorDialog(parsedData);
        });

        socket.on(DialogType.COMPLETED_SESSION, (data) => {
          const parsedData = JSON.parse(data);
          const berthId = `berth_${parsedData?.berth?.id}_${parsedData?.sessionId}`;

          if (!(berthId in sessionCompleteDialogs)) {
            showsCompleteSessionDialog(sessionCompleteDialogs, parsedData);
          }
        });
      });
    }

    return () => {
      cleanupSocket(socket);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorDialogs, sessionCompleteDialogs, socket]);

  return (
    <HomeLayout>
      <Box className={styles.container}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box className={styles.habourDetails}>
            <Avatar
              src="/images/icons/anchor.png"
              className={styles.habourIcon}
              alt="Habour Icon"
            />
            <Box>
              <Box className={styles.habourName}>
                {i18next.language.includes("en")
                  ? habour?.nameEn
                  : habour?.name}
              </Box>
              <Box className={styles.habourAddress}>{habour?.address}</Box>
            </Box>
          </Box>
          <Tooltip title="Reload" arrow>
            <IconButton color="primary" onClick={handleReload}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={3}>
          {berths?.map((berth) => (
            <Grid item xs={12} md={4} lg={3} key={berth?.id}>
              <BerthCard data={berth} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </HomeLayout>
  );
};
