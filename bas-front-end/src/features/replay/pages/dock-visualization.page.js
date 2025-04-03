import { BERTH_STATUS } from "common/constants/berth.constant";
import { RecordManagementService } from "common/services";
import { first, pick } from "lodash";
import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { PlayerToolbar } from "../components";
import { DockPageContent } from "./dock-content.page";

const RECORDS_PER_PAGE = 1000;
const PREFETCH_THRESHOLD = 0.8; // Prefetch when 80% through current page

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
  const loadingPagesRef = useRef(new Set()); // Track pages being loaded

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

  const fetchPageData = async (page) => {
    if (pagesRef.current[page] || loadingPagesRef.current.has(page)) {
      return;
    }

    loadingPagesRef.current.add(page);
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

        pagesRef.current[page] = {
          count,
          items: transformedRecords,
        };
      }
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
    } finally {
      loadingPagesRef.current.delete(page);
      if (page === Math.floor(index / RECORDS_PER_PAGE)) {
        setIsLoadingChunk(false);
      }
    }
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

        // Prefetch next page immediately
        if (total > RECORDS_PER_PAGE) {
          fetchPageData(1);
        }
      }
    } catch (error) {}
  };

  const fetchNextPageData = fetchPageData; // For backward compatibility

  const getDataPointData = (dataPointIndex) => {
    const page = Math.floor(dataPointIndex / RECORDS_PER_PAGE);
    const pageIndex = dataPointIndex % RECORDS_PER_PAGE;

    if (page in pagesRef.current) {
      const isNearPageEnd = pageIndex > RECORDS_PER_PAGE * PREFETCH_THRESHOLD;
      if (isNearPageEnd && totalRecords > (page + 1) * RECORDS_PER_PAGE) {
        fetchPageData(page + 1);
      }
      return pagesRef.current?.[page]?.["items"]?.[pageIndex];
    } else {
      if (!loadingPagesRef.current.has(page)) {
        setIsLoadingChunk(true);
        fetchPageData(page);
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
      newSpeedRate = 4;
    } else if (speedRate === 4) {
      newSpeedRate = 8;
    } else if (speedRate === 8) {
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

          if (index === totalRecords - 1) {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
          } else {
            setIndex((prev) => prev + 1);
          }
        } else if (isLoadingChunk) {
          clearInterval(intervalRef.current);
        }
      }, 200 / speedRate);

      return () => clearInterval(intervalRef.current);
    } else if (isPlaying && isLoadingChunk) {

      const resumeTimer = setTimeout(() => {
        if (!isLoadingChunk) {
          setIsPlaying(true);
        }
      }, 100);
      return () => clearTimeout(resumeTimer);
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
