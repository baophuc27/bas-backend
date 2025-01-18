import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import moment from "moment";
import { isEmpty } from "lodash";

import AngleIcon from "assets/images/angle.svg";
import DistanceIcon from "assets/images/distance.svg";
import SpeedIcon from "assets/images/speed.svg";

import { useQuery } from "common/hooks";
import { BerthService } from "common/services";
import { BERTH_STATUS } from "common/constants/berth.constant";

import { DockPageContent } from "./dock-content.page";
import AlarmSettingDialog from "../components/alarm-setting-dialog/alarm-setting-dialog.component";
import BerthingSettingDialogComponent from "../components/berthing-setting-dialog/berthing-setting-dialog.component";
import { AlarmStatusColor, NORMAL_STATUS_ID } from "../constants/alarm-status";
import { formatValue, getUnit } from "../helpers";
import { useSocket } from "../hooks/use-socket";

const AlarmTypeIcon = {
  ANGLE: AngleIcon,
  DISTANCE: DistanceIcon,
  SPEED: SpeedIcon,
};

export const DockVisualizationPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useQuery();

  const [berth, setBerth] = useState({});
  const [updatedBerth, setUpdatedBerth] = useState({});
  const [pastData, setPastData] = useState([]);
  const [hasPastData, setHasPastData] = useState(false);

  const [showsDetailSettings, setShowsDetailSettings] = useState(false);
  const [showsBerthingSettings, setShowsBerthingSettings] = useState(false);
  const [showsAlarmSetting, setShowsAlarmSetting] = useState(false);

  const alarmSettingRef = useRef(null);

  const {
    basSocket,
    deviceSocket,
    portsSocket,
    socketData,
    joinDockSockets,
    leaveDockSockets,
    pauseDeviceData,
    resumeDeviceData,
    lastDataTimestamp,
  } = useSocket(id);

  const [isDialogShowing, setIsDialogShowing] = useState(false);

  /**
   * Handle opening/closing dialogs
   */
  const onCloseBerthingSettings = ({ forcesBack = false }) => {
    setShowsBerthingSettings(false);
    if (forcesBack) {
      navigate("/");
    }
  };

  const onCloseAlarmSettings = () => setShowsAlarmSetting(false);
  const onCloseDetailSettings = () => setShowsDetailSettings(false);
  const onRefetchAlarmData = () => alarmSettingRef.current?.fetchData?.();

  /**
   * Fetch the Berth details from your API
   */
  const fetchBerthDetail = async (berthId) => {
    try {
      const response = await BerthService.getDetail(berthId);
      if (!response?.data?.success) {
        toast.error(response?.data?.message ?? "Error");
        return;
      }
      setBerth(response.data.data);
      setUpdatedBerth(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Fetch past data (e.g., alarm records) within last 2 hours
   */
  const fetchPastData = async (berthId, berthInfo) => {
    try {
      const response = await BerthService.getLatestRecords(
        berthId,
        moment().subtract(2, "hours").format("YYYY-MM-DD HH:mm:ss"),
        moment().format("YYYY-MM-DD HH:mm:ss"),
      );
      if (response?.data?.success) {
        let records = [];
        let count = 0;
        for (let record of response.data.record) {
          if (
            record?.alarm &&
            record.alarm !== NORMAL_STATUS_ID &&
            record.endTime
          ) {
            let type = record?.type?.toUpperCase();
            let value = formatValue(Math.abs(record.value));

            records.push({
              type,
              value: `${value}${getUnit(record.type)}`,
              zone: record.zone,
              sensor: record.side
                ? record.side === 1
                  ? t("alarm:left")
                  : t("alarm:right")
                : "-",
              startTime: moment(record.startTime).format("HH:mm:ss:SSS"),
              endTime: moment(record.endTime).format("HH:mm:ss:SSS"),
              alarmColor: AlarmStatusColor[record.alarm],
              iconType: AlarmTypeIcon[type],
            });
            count++;
          }
        }
        if (count > 0) {
          setPastData(records);
          setHasPastData(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch past data", error);
    }
  };

  /**
   * On mount (and whenever `id` changes), fetch berth detail,
   * join the dock sockets, and resume device data.
   */
  useEffect(() => {
    if (id) {
      fetchBerthDetail(id);
      joinDockSockets(id);
      resumeDeviceData();
    }

    return () => {
      leaveDockSockets(id);
      pauseDeviceData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /**
   * Whenever `updatedBerth` is set, fetch past data.
   */
  useEffect(() => {
    if (!isEmpty(updatedBerth)) {
      fetchPastData(id, updatedBerth);
    }
  }, [id, updatedBerth]);

  /**
   * Sync `berth` with `updatedBerth`. If status changes to AVAILABLE,
   * navigate back to home.
   */
  useEffect(() => {
    if (JSON.stringify(updatedBerth) !== JSON.stringify(berth)) {
      setBerth(updatedBerth);
      if (updatedBerth?.status?.id === BERTH_STATUS.AVAILABLE) {
        navigate("/");
      }
    }
  }, [updatedBerth, berth, navigate]);

  /**
   * Periodically re-check the berth status from server every 10s.
   * If it changes from your local state, show a SweetAlert and navigate if needed.
   */
  useEffect(() => {
    let isChecking = false;
    const interval = setInterval(async () => {
      if (isDialogShowing || isChecking) return;

      isChecking = true;
      try {
        const response = await BerthService.getDetail(id);
        if (response?.data?.success && response?.data?.data) {
          const newData = response.data.data;
          if (berth?.status?.id !== newData?.status?.id) {
            setIsDialogShowing(true);
            setTimeout(() => {
              swal({
                title: t("dock:dialogs.status-changed.title"),
                text: t("dock:dialogs.status-changed.message"),
                icon: "warning",
                buttons: {
                  ok: {
                    text: t("dock:dialogs.status-changed.ok"),
                    value: true,
                  },
                },
              }).then(() => {
                setIsDialogShowing(false);
                if (newData?.status?.id === BERTH_STATUS.AVAILABLE) {
                  navigate("/");
                } else if (
                  [
                    BERTH_STATUS.BERTHING,
                    BERTH_STATUS.DEPARTING,
                    BERTH_STATUS.MOORING,
                  ].includes(newData?.status?.id)
                ) {
                  window.location.reload();
                }
              });
            }, 3000); // 3 second delay
          }
        }
      } catch (error) {
        // console.error("Failed to check berth status:", error);
      }
      isChecking = false;
    }, 5000);

    return () => clearInterval(interval);
  }, [berth?.status?.id, id, navigate, t, isDialogShowing]);

  /**
   * Render the main Dock visualization page
   */
  return (
    <>
      <DockPageContent
        socket={basSocket}
        id={id}
        berth={berth}
        setShowsBerthingSettings={setShowsBerthingSettings}
        setShowsDetailSettings={setShowsDetailSettings}
        setShowsAlarmSetting={setShowsAlarmSetting}
        optimized={query.get("optimized") === "true"}
        pastData={pastData}
        hasPastData={hasPastData}
        portsSocket={portsSocket}
      />

      {/* Berthing Settings Dialog */}
      <BerthingSettingDialogComponent
        open={showsBerthingSettings}
        handleClose={onCloseBerthingSettings}
        data={updatedBerth}
        setData={setUpdatedBerth}
        socketData={socketData}
        refetchAlarmData={onRefetchAlarmData}
      />

      {/* Alarm Settings Dialog */}
      <AlarmSettingDialog
        ref={alarmSettingRef}
        open={showsAlarmSetting}
        handleClose={onCloseAlarmSettings}
      />
    </>
  );
};
