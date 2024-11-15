import { Box } from "@material-ui/core";
import { useScreenSize } from "common/hooks";
import { RecordManagementService } from "common/services";
import ReactECharts from "echarts-for-react";
import { first, last } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatValue } from "../helpers";
import styles from "./sensor-charts.style.module.css";

const INTERVAL_IN_SECONDS = 30;

const SensorChart = ({ title, data, prefix }) => {
  const { t } = useTranslation();
  const { width: screenWidth } = useScreenSize();

  let distanceData = [];
  let startTime = moment(first(data)?.time);
  let endTime = moment(last(data)?.time);

  const findLatestDataPoint = (start, end, rangeData) => {
    let result = {
      time: end?.format(),
      leftDistance: null,
      rightDistance: null,
      leftSpeed: null,
      rightSpeed: null,
    };

    const dataPoints = rangeData?.filter(
      (item) => moment(item?.time) >= start && moment(item?.time) <= end,
    );

    if (dataPoints?.length > 0) {
      result = last(dataPoints);
    }

    return result;
  };

  // while (startTime <= endTime) {
  //   const dataPoint = findLatestDataPoint(
  //     startTime.clone(),
  //     startTime.clone().add(INTERVAL_IN_SECONDS, "seconds"),
  //     data,
  //   );
  //
  //   distanceData.push(dataPoint);
  //   startTime = startTime.add(INTERVAL_IN_SECONDS, "seconds");
  // }

  const options = {
    grid: {
      top: 8,
      right: 8,
      bottom: 24,
      left: 36,
    },
    xAxis: {
      type: "time",
      splitNumber: screenWidth / 140,
      connectNulls: false,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: t("record-management:charts.distance"),
        data: data?.map((item) => [
          item?.time,
          formatValue(item?.[`${prefix}Distance`]) || null,
        ]),
        type: "line",
        smooth: true,
      },
      {
        name: t("record-management:charts.speed"),
        data: data?.map((item) => [
          item?.time,
          formatValue(item?.[`${prefix}Speed`]) || null,
        ]),
        type: "line",
        smooth: true,
      },
    ],
    tooltip: {
      trigger: "axis",
    },
  };

  return (
    <Box mb={3}>
      <p className={styles.sectionSecondaryTitle}>{title}</p>
      <ReactECharts option={options} />
    </Box>
  );
};

export const SensorCharts = ({ recordId }) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);

  const fetchData = async (id) => {
    try {
      const response = await RecordManagementService.getChartsData(id);

      if (response?.data?.success) {
        setData(response?.data?.data?.chart);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchData(recordId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordId]);

  return (
    <Box mt={3}>
      <p className={styles.sectionPrimaryTitle}>
        {t("record-management:charts.title")}
      </p>

      <Box mt={2}>
        <SensorChart
          title={t("record-management:charts.left-sensor")}
          data={data}
          prefix="left"
        />

        <SensorChart
          title={t("record-management:charts.right-sensor")}
          data={data}
          prefix="right"
        />
      </Box>
    </Box>
  );
};
