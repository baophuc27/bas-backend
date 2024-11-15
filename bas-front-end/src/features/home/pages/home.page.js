import { Avatar, Box, Grid } from "@material-ui/core";
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

        if (response?.data?.isSync === true) {
          notify("success", t("dock:messages.sync-success"));
        } else {
          notify("error", t("dock:messages.sync-error"));
        }
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

        if (response?.data?.data?.isSync === true) {
          notify("success", t("dock:messages.sync-success"));
        } else {
          notify("error", t("dock:messages.sync-error"));
        }
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

  const showsCompleteSessionDialog = async (completeDialogs, data) => {
    const berthId = `berth_${data?.berth?.id}_${data?.sessionId}`;

    if (!(berthId in completeDialogs)) {
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

  useEffect(() => {
    initSocket();
    fetchBerths();
    fetchHabourData();

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
      if (socket) {
        socket.off("connect");
        socket.off(DialogType.DEVICE_ERROR);
        socket.off(DialogType.COMPLETED_SESSION);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorDialogs, sessionCompleteDialogs, socket]);

  return (
    <HomeLayout>
      <Box className={styles.container}>
        <Box className={styles.habourDetails}>
          <Avatar
            src="/images/icons/anchor.png"
            className={styles.habourIcon}
            alt="Habour Icon"
          />

          <Box>
            <Box className={styles.habourName}>
              {i18next.language.includes("en") ? habour?.nameEn : habour?.name}
            </Box>
            <Box className={styles.habourAddress}>{habour?.address}</Box>
          </Box>
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
