import { Box, IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { AuthCheck } from "common/components";
import { BERTH_STATUS } from "common/constants/berth.constant";
import { tabletRegExp } from "common/constants/regex.constant";
import { isEmpty } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, Hud, Visualization } from "../components";
import { NORMAL_STATUS_ID } from "../constants/alarm-status";
import styles from "./dock.style.module.css";

export const DockPageContent = ({ id, berth: berthData, latestData }) => {
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });
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
  const [sensorAId, setSensorAId] = useState("LEFT");
  const [sensorBId, setSensorBId] = useState("RIGHT");
  const userAgent = navigator.userAgent.toLowerCase();
  const isTablet = tabletRegExp.test(userAgent);
  const [zoom, setZoom] = useState(isTablet ? 0.4 : 0.3);
  const [gettingRTData, setGettingRTData] = useState(false);

  const onBack = () => navigate("/dashboard/record-management");

  useEffect(() => {
    const handleResize = () => {
      if (mainRef.current) {
        setDimensions({
          width: mainRef.current.clientWidth,
          height: mainRef.current.clientHeight,
        });
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(berthData)) {
      // setSensorAId(berthData?.leftDevice?.id);
      // setSensorBId(berthData?.rightDevice?.id);

      if (berthData?.status?.id === BERTH_STATUS.MOORING) {
        setSensorAData({
          speed: 0,
          distance: 5,
          status_id: NORMAL_STATUS_ID,
        });

        setSensorBData({
          speed: 0,
          distance: 5,
          status_id: NORMAL_STATUS_ID,
        });

        setAngleData({
          value: 0,
          status_id: NORMAL_STATUS_ID,
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [berthData]);

  useEffect(() => {
    if (!isEmpty(latestData)) {
      setGettingRTData(true);

      // Check whether the session has finished
      const leftSpeed = latestData?.speed?.[sensorAId]?.value;
      const rightSpeed = latestData?.speed?.[sensorBId]?.value;

      const sensorAToFender = berthData?.distanceToLeft || 0;
      const sensorBToFender = berthData?.distanceToRight || 0;

      // const leftDistance = latestData?.distance?.[sensorAId]?.value;
      // const rightDistance = latestData?.distance?.[sensorBId]?.value;

      const leftDistance = Math.max(
        latestData?.distance?.[sensorAId]?.value - sensorAToFender,
        0,
      );
      const rightDistance = Math.max(
        latestData?.distance?.[sensorBId]?.value - sensorBToFender,
        0,
      );

      setSensorAData({
        speed: leftSpeed,
        // distance: leftDistance,
        distance: latestData?.distance?.[sensorAId]?.value,
        distance_status_id: latestData?.distance?.[sensorAId]?.alarm,
        speed_status_id: latestData?.speed?.[sensorAId]?.alarm,
        original_distance: latestData?.distance?.[sensorAId]?.value,
      });

      setSensorBData({
        speed: rightSpeed,
        // distance: rightDistance,
        distance: latestData?.distance?.[sensorBId]?.value,
        distance_status_id: latestData?.distance?.[sensorBId]?.alarm,
        speed_status_id: latestData?.speed?.[sensorBId]?.alarm,
        original_distance: latestData?.distance?.[sensorBId]?.value,
      });

      setAngleData({
        value: latestData?.angle?.value,
        status_id: latestData?.angle?.alarm,
      });
    } else {
      setGettingRTData(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestData]);

  const isShipVisible = useMemo(() => {
    //  (isMooring && !gettingRTData) || (gettingRTData && !hasDeviceErrors)

    if (gettingRTData) {
      return true;
    }

    return false;
  }, [gettingRTData]);

  return (
    <AuthCheck>
      <Box className={styles.container}>
        <Box className={styles.main} ref={mainRef}>
          <Visualization
            width={dimensions.width}
            height={dimensions.height}
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
            isMooring={berthData?.status?.id === BERTH_STATUS.MOORING}
            gettingRTData={gettingRTData}
            // sensorAHasErrors={
            //   "error" in latestData && "left_sensor" in latestData?.error
            // }
            // sensorBHasErrors={
            //   "error" in latestData && "right_sensor" in latestData?.error
            // }
            shipDirection={
              berthData?.vesselDirection === true ? "right" : "left"
            }
            isShipVisible={isShipVisible}
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
                  {/* <Box
                    className={styles.status}
                    style={{
                      background: BERTH_STATUS_COLOR[berthData?.status?.id],
                    }}
                  >
                    {berthData?.status?.nameEn}
                  </Box> */}

                  <Box className={styles.dockName}>{berthData?.name}</Box>

                  <Box className={styles.shipName}>
                    {berthData?.currentVessel?.nameEn}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Hud
            hasData={gettingRTData}
            sensorAData={sensorAData}
            sensorBData={sensorBData}
            angleData={angleData}
            sensorA={berthData?.leftDevice}
            sensorB={berthData?.rightDevice}
          />
        </Box>
      </Box>
    </AuthCheck>
  );
};
