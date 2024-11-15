import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { RecordManagementService } from "common/services";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./record-aggregate-table.style.module.css";

const PairTable = ({ title, leftSensorData, rightSensorData }) => {
  const { t } = useTranslation();

  return (
    <Box mb={3}>
      <p className={styles.sectionSecondaryTitle}>{title}</p>

      <Table className={styles.table}>
        <TableHead
          style={{
            backgroundColor: "#E5E5E5",
          }}
        >
          <TableRow>
            <TableCell colSpan={3} className={styles.tableCell}>
              {t("record-management:aggregate-table.left-sensor")}
            </TableCell>

            <TableCell colSpan={3} className={styles.tableCell}>
              {t("record-management:aggregate-table.right-sensor")}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className={styles.tableCell}>
              {t("record-management:aggregate-table.min")}
            </TableCell>

            <TableCell className={styles.tableCell}>
              {t("record-management:aggregate-table.average")}
            </TableCell>

            <TableCell className={styles.tableCell}>
              {t("record-management:aggregate-table.max")}
            </TableCell>

            <TableCell className={styles.tableCell}>
              {t("record-management:aggregate-table.min")}
            </TableCell>

            <TableCell className={styles.tableCell}>
              {t("record-management:aggregate-table.average")}
            </TableCell>

            <TableCell className={styles.tableCell}>
              {t("record-management:aggregate-table.max")}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell className={styles.tableCell}>
              {leftSensorData?.min ?? "--"}
            </TableCell>
            <TableCell className={styles.tableCell}>
              {leftSensorData?.average ?? "--"}
            </TableCell>
            <TableCell className={styles.tableCell}>
              {leftSensorData?.max ?? "--"}
            </TableCell>
            <TableCell className={styles.tableCell}>
              {rightSensorData?.min ?? "--"}
            </TableCell>
            <TableCell className={styles.tableCell}>
              {rightSensorData?.average ?? "--"}
            </TableCell>
            <TableCell className={styles.tableCell}>
              {rightSensorData?.max ?? "--"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

const SingleTable = ({ title, sensorData }) => {
  const { t } = useTranslation();

  return (
    <Box mb={3}>
      <p className={styles.sectionSecondaryTitle}>{title}</p>

      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            <TableCell className={styles.tableCell}>
              {t("record-management:aggregate-table.min")}
            </TableCell>

            <TableCell className={styles.tableCell}>
              {t("record-management:aggregate-table.average")}
            </TableCell>

            <TableCell className={styles.tableCell}>
              {t("record-management:aggregate-table.max")}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell className={styles.tableCell}>
              {sensorData?.min ?? "--"}
            </TableCell>
            <TableCell className={styles.tableCell}>
              {sensorData?.average ?? "--"}
            </TableCell>
            <TableCell className={styles.tableCell}>
              {sensorData?.max ?? "--"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export const RecordAggregateTable = ({ recordId }) => {
  const { t } = useTranslation();
  const [speedData, setSpeedData] = useState({});
  const [angleData, setAngleData] = useState({});

  const fetchData = async (id) => {
    try {
      const response = await RecordManagementService.getAggregatedData(id);

      if (response?.data?.success) {
        const aggregatedData = response?.data?.data?.aggregates;

        setSpeedData({
          leftSensor: {
            min: aggregatedData?.minLeftSpeed,
            max: aggregatedData?.maxLeftSpeed,
            average: aggregatedData?.avgLeftSpeed,
          },
          rightSensor: {
            min: aggregatedData?.minRightSpeed,
            max: aggregatedData?.maxRightSpeed,
            average: aggregatedData?.avgRightSpeed,
          },
        });

        setAngleData({
          min: aggregatedData?.minAngle,
          max: aggregatedData?.maxAngle,
          average: aggregatedData?.avgAngle,
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchData(recordId);
  }, [recordId]);

  return (
    <Box mt={3}>
      <p className={styles.sectionPrimaryTitle}>
        {t("record-management:aggregate-table.title")}
      </p>

      <Box mt={2}>
        <PairTable
          title={t("record-management:aggregate-table.speed")}
          leftSensorData={speedData?.leftSensor}
          rightSensorData={speedData?.rightSensor}
        />
        <SingleTable
          title={t("record-management:aggregate-table.angle")}
          sensorData={angleData}
        />
      </Box>
    </Box>
  );
};
