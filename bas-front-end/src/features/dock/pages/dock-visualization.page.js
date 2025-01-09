import AngleIcon from "assets/images/angle.svg";
import DistanceIcon from "assets/images/distance.svg";
import SpeedIcon from "assets/images/speed.svg";
import { BERTH_STATUS } from "common/constants/berth.constant";
import { useQuery } from "common/hooks";
import { BerthService } from "common/services";
import { isEmpty } from "lodash";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import AlarmSettingDialog from "../components/alarm-setting-dialog/alarm-setting-dialog.component";
import BerthingSettingDialogComponent from "../components/berthing-setting-dialog/berthing-setting-dialog.component";
import { AlarmStatusColor, NORMAL_STATUS_ID } from "../constants/alarm-status";
import { formatValue, getUnit } from "../helpers";
import { DockPageContent } from "./dock-content.page";
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
  const [updatedBerth, setUpdatedBerth] = useState({});
  const [berth, setBerth] = useState({});
  const [showsDetailSettings, setShowsDetailSettings] = useState(false);
  const [showsBerthingSettings, setShowsBerthingSettings] = useState(false);
  const [showsAlarmSetting, setShowsAlarmSetting] = useState(false);
  const alarmSettingRef = useRef(null);
  const query = useQuery();
  const [pastData, setPastData] = useState([]);
  const [hasPastData, setHasPastData] = useState(false);
  const {
    basSocket,
    deviceSocket,
    portsSocket,
    socketData,
    joinDockSockets,
    leaveDockSockets,
    pauseDeviceData,
    resumeDeviceData,
  } = useSocket(id);
  const [isBerthingStarted, setIsBerthingStarted] = useState(false);
  const [currentBerthStatus, setCurrentBerthStatus] = useState(null);

  const onCloseBerthingSettings = ({ forcesBack = false }) => {
    setShowsBerthingSettings(false);
    if (forcesBack === true) {
      navigate("/");
    }
  };

  const fetchBerthDetail = async (id) => {
    try {
      const response = await BerthService.getDetail(id);
      if (!response?.data?.success) {
        toast.error(response?.data?.message ?? "Error");
        return;
      }
      setBerth(response?.data?.data);
      setUpdatedBerth(response?.data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onCloseAlarmSettings = () => setShowsAlarmSetting(false);
  const onCloseDetailSettings = () => setShowsDetailSettings(false);
  const onRefetchAlarmData = () => alarmSettingRef.current?.fetchData();

  const fetchPastData = async (id, updatedBerth) => {
    try {
      const response = await BerthService.getLatestRecords(
        id,
        moment()?.subtract(2, "hours")?.format("YYYY-MM-DD HH:mm:ss"),
        moment()?.format("YYYY-MM-DD HH:mm:ss"),
      );
      if (response?.data?.success) {
        let records = [];
        let recordsCount = 0;
        for (let record of response?.data?.record) {
          if (record?.alarm && record?.alarm !== NORMAL_STATUS_ID) {
            let type = record?.type?.toUpperCase();
            let value = formatValue(Math.abs(record?.value));
            if (record?.endTime) {
              records.push({
                type,
                value: `${value}${getUnit(record?.type)}`,
                zone: record?.zone,
                sensor: record?.side
                  ? record?.side === 1
                    ? t("alarm:left")
                    : t("alarm:right")
                  : "-",
                startTime: moment(record?.startTime).format("HH:mm:ss:SSS"),
                endTime: record?.endTime
                  ? moment(record?.endTime).format("HH:mm:ss:SSS")
                  : "-",
                alarmColor: AlarmStatusColor[record?.alarm],
                iconType: AlarmTypeIcon[record?.type?.toUpperCase()],
              });
              recordsCount += 1;
            }
          }
        }
        if (recordsCount > 0) {
          setPastData(records);
          setHasPastData(true);
        }
      }
    } catch (error) {}
  };

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
  }, [id]);

  useEffect(() => {
    if (!isEmpty(updatedBerth)) {
      fetchPastData(id, updatedBerth);
    }
  }, [id, updatedBerth]);

  useEffect(() => {
    if (JSON.stringify(updatedBerth) !== JSON.stringify(berth)) {
      setBerth(updatedBerth);
      if (updatedBerth?.status?.id === BERTH_STATUS.AVAILABLE) {
        navigate("/");
      }
    }
  }, [updatedBerth]);

  useEffect(() => {
    if (basSocket?.connected) {
      setIsBerthingStarted(true);
    }
  }, [basSocket]);

  const checkBerthStatus = async () => {
    try {
      const response = await BerthService.getDetail(id);
      if (response?.data?.success) {
        const newStatus = response?.data?.data?.status?.id;
        if (currentBerthStatus && newStatus !== BERTH_STATUS.PROCESSING) {
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
            navigate("/");
          });
        }
        setCurrentBerthStatus(newStatus);
      }
    } catch (error) {
      console.error("Error checking berth status:", error);
    }
  };

  useEffect(() => {
    if (!isBerthingStarted) return;
    const statusCheckInterval = setInterval(checkBerthStatus, 10000);
    return () => clearInterval(statusCheckInterval);
  }, [isBerthingStarted, id]);

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

      <BerthingSettingDialogComponent
        open={showsBerthingSettings}
        handleClose={onCloseBerthingSettings}
        data={updatedBerth}
        setData={setUpdatedBerth}
        socketData={socketData}
        refetchAlarmData={onRefetchAlarmData}
      />

      <AlarmSettingDialog
        ref={alarmSettingRef}
        open={showsAlarmSetting}
        handleClose={onCloseAlarmSettings}
      />
    </>
  );
};
