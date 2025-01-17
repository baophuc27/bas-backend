import { BERTH_STATUS } from "common/constants/berth.constant";
import { RecordManagementService } from "common/services";
import { first, pick } from "lodash";
import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { PlayerToolbar } from "../components";
import { DockPageContent } from "./dock-content.page";

const RECORDS_PER_PAGE = 1000;

export const DockVisualizationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [updatedBerth, setUpdatedBerth] = useState({});
  const [berth, setBerth] = useState({});
  const [latestData, setLatestData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [speedRate, setSpeedRate] = useState(2);
  const [sessionData, setSessionData] = useState({});
  const intervalRef = useRef(null);
  const [totalRecords, setTotalRecords] = useState(0);

  const pagesRef = useRef({});
  const sessionId = searchParams.get("sessionId");
  const [isLoadingChunk, setIsLoadingChunk] = useState(false);

  const transformRecords = (records) => {
    let count = 0;
    let transformedRecords = [];
    let item = null;

    for (let i = 0; i < records?.length; i++) {
      item = records?.[i];

      transformedRecords.push({
        speed: {
          LEFT: {
            value: item?.leftSpeed,
            alarm: item?.LSpeedAlarm,
            zone: item?.LSpeedZone,
          },
          RIGHT: {
            value: item?.rightSpeed,
            alarm: item?.RSpeedAlarm,
            zone: item?.RSpeedZone,
          },
        },
        distance: {
          LEFT: {
            value: item?.leftDistance,
            alarm: item?.LDistanceAlarm,
            zone: item?.LDistanceZone,
          },
          RIGHT: {
            value: item?.rightDistance,
            alarm: item?.RDistanceAlarm,
            zone: item?.RDistanceZone,
          },
        },
        angle: {
          value: item?.angle,
          alarm: item?.angleZone,
          status: item?.angleAlarm,
        },
        error: {},
        time: item?.time,
      });
    }

    return {
      count,
      transformedRecords,
    };
  };

  const fetchInitialData = async (id) => {
    try {
      const params = {
        page: 0,
        order: "asc",
        amount: RECORDS_PER_PAGE,
      };

      const resp = await RecordManagementService.getDetail(id, params);

      if (resp?.data?.success) {
        const dataRecord = resp?.data?.data;
        const total = resp?.data?.count;
        const records = resp?.data?.data?.recordHistories;

        const berth = {
          ...dataRecord?.berth,
          ...pick(dataRecord, [
            "vessel",
            "limitZone1",
            "limitZone2",
            "limitZone3",
            "distanceDevice",
            "distanceFender",
            "distanceToLeft",
            "distanceToRight",
            "vesselDirection",
            "directionCompass",
          ]),
        };

        berth["vesselDirection"] = berth?.vesselDirection === 1 ? true : false;
        berth["currentVessel"] = berth?.vessel;

        const { count, transformedRecords } = transformRecords(records);

        setLatestData(first(transformedRecords));
        setBerth(berth);
        setUpdatedBerth(berth);
        setSessionData(resp?.data?.data);

        pagesRef.current[0] = {
          count,
          items: transformedRecords,
        };
        setTotalRecords(total);
      }
    } catch (error) {}
  };

  const fetchNextPageData = async (page) => {
    try {
      const params = {
        page,
        order: "asc",
        amount: RECORDS_PER_PAGE,
      };

      const resp = await RecordManagementService.getDetail(sessionId, params);

      if (resp?.data?.success) {
        const records = resp?.data?.data?.recordHistories;
        const { count, transformedRecords } = transformRecords(records);

        setLatestData(first(transformedRecords));

        pagesRef.current[page] = {
          count,
          items: transformedRecords,
        };

        let timer = setTimeout(() => {
          setIsLoadingChunk(false);
          clearTimeout(timer);
        }, 3000);
      }
    } catch (error) {}
  };

  const getDataPointData = (dataPointIndex) => {
    const page = Math.floor(dataPointIndex / RECORDS_PER_PAGE);
    const pageIndex = dataPointIndex % RECORDS_PER_PAGE;

    if (page in pagesRef.current) {
      return pagesRef.current?.[page]?.["items"]?.[pageIndex];
    } else {
      if (!isLoadingChunk) {
        setIsLoadingChunk(true);
        fetchNextPageData(page);
      }
    }

    return null;
  };

  const onPlay = () => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const onReplay = () => {
    clearInterval(intervalRef.current);
    setIsPlaying(true);
    setIndex(0);
    setLatestData(pagesRef.current?.[0]?.["items"]?.[0]);
  };

  const onSpeed = () => {
    let newSpeedRate;

    if (speedRate === 2) {
      newSpeedRate = 1;
    } else if (speedRate === 1) {
      newSpeedRate = 1.5;
    } else {
      newSpeedRate = 2;
    }

    setSpeedRate(newSpeedRate);
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!sessionId) return;

    fetchInitialData(sessionId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    if (JSON.stringify(updatedBerth) !== JSON.stringify(berth)) {
      setBerth(updatedBerth);

      if (updatedBerth?.status?.id === BERTH_STATUS.AVAILABLE) {
        navigate("/");
      }
    }
  }, [updatedBerth, berth, navigate]);

  useEffect(() => {
    if (totalRecords > 0 && isPlaying && !isLoadingChunk) {
      intervalRef.current = setInterval(() => {
        const dataPoint = getDataPointData(index);

        if (dataPoint) {
          setLatestData(dataPoint);
        }

        if (index === totalRecords - 1) {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
        } else {
          setIndex((prev) => prev + 1);
        }
      }, 200 / speedRate);

      return () => clearInterval(intervalRef.current);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingChunk, totalRecords, isPlaying, index, speedRate]);

  if (sessionId === "") {
    return <Navigate to="/dashboard/record-management" />;
  }

  return (
    <>
      <DockPageContent id={sessionId} berth={berth} latestData={latestData} />
      <PlayerToolbar
        startTime={sessionData?.startTime}
        isPlaying={isPlaying}
        onPlay={onPlay}
        onReplay={onReplay}
        currentTime={latestData?.time}
        endTime={sessionData?.endTime}
        speedRate={speedRate}
        onSpeed={onSpeed}
        isFinished={index === totalRecords - 1}
        currentIndex={index}
        lastIndex={totalRecords - 1}
        isLoadingChunk={isLoadingChunk}
      />
    </>
  );
};
