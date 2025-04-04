import { Circle, Group, Layer, Line, Rect, Stage, Text } from "react-konva";
import { AlarmStatusColor, NORMAL_STATUS_ID } from "../constants/alarm-status";
// import { formatValue } from "../helpers";
import { t } from "i18next";
import { Ship } from "./ship.component";

const HABOUR_WIDTH = 78;
const HABOUR_HEIGHT = 12;
const SENSOR_WIDTH = 24;
const SENSOR_HEIGHT = 24;

const calcShipProperties = ({
  xA,
  yA,
  xD,
  yD,
  rectHeight,
  offsetA,
  offsetD,
}) => {
  const deltaX = xD - xA;
  const deltaY = yD - yA;
  const theta = Math.atan2(deltaY, deltaX);
  const lengthAD = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const totalLength = lengthAD + offsetA + offsetD;

  const startX = xA - offsetA * Math.cos(theta);
  const startY = yA - offsetA * Math.sin(theta);

  return {
    startX,
    startY,
    theta,
    lengthAD,
    totalLength,
    rectWidth: totalLength,
    rectHeight,
  };
};

export const Visualization = ({
  width,
  height,
  zoom = 1,
  limitZone1 = null,
  limitZone2 = null,
  limitZone3 = null,
  distanceToFender = 20,
  distanceToLeft,
  sensorsDistance,
  sensorAData,
  sensorBData,
  shipLength = 100,
  gettingRTData = false,
  isMooring = false,
  sensorAHasErrors = false,
  sensorBHasErrors = false,
  shipDirection = "right",
  isShipVisible = false,
}) => {
  const getDrawingDistance = (actualDistance) => {
    return ((actualDistance * width) / HABOUR_WIDTH) * zoom;
  };

  const habourWidth = getDrawingDistance(HABOUR_WIDTH);
  const habourHeight = getDrawingDistance(HABOUR_HEIGHT);

  const habourX = (width - habourWidth) / 2;
  const habourY = height - 170; // hud height
  const sensorY = habourY + getDrawingDistance(distanceToFender) - 20;
  const shipWidth = (getDrawingDistance(shipLength) * 93) / 643;

  const hasDeviceErrors = sensorAHasErrors || sensorBHasErrors;

  const {
    startX,
    startY,
    theta,
    rectWidth: shipRectWidth,
    rectHeight: shipRectHeight,
  } = calcShipProperties({
    xA: habourX + getDrawingDistance(distanceToLeft) + SENSOR_WIDTH / 2,
    yA:
      // habourY +
      // getDrawingDistance(distanceToFender) -
      habourY - getDrawingDistance(sensorAData?.distance),
    xD:
      habourX +
      getDrawingDistance(distanceToLeft) +
      getDrawingDistance(sensorsDistance) +
      SENSOR_WIDTH / 2,
    yD:
      // habourY +
      // getDrawingDistance(distanceToFender) -
      habourY - getDrawingDistance(sensorBData?.distance),
    rectHeight: shipWidth,
    offsetA:
      (getDrawingDistance(shipLength) - getDrawingDistance(sensorsDistance)) /
      2,
    offsetD:
      (getDrawingDistance(shipLength) - getDrawingDistance(sensorsDistance)) /
      2,
  });

  return (
    <Stage width={width} height={height}>
      <Layer>
        <Rect x={0} y={0} width={width} height={height} fill="#78cfee" />
      </Layer>

      <Layer>
        {/* <Circle radius={5} x={habourX} y={habourY} fill="red" /> */}

        <Group name="limit-zones">
          <Group name="limit-zone-1" visible={limitZone1 !== null}>
            <Line
              points={[
                0,
                habourY - getDrawingDistance(limitZone1),
                width,
                habourY - getDrawingDistance(limitZone1),
              ]}
              stroke="#53A1F5"
              strokeWidth={2}
            />

            <Text
              text={`${t("berth:general_information.ZONE")} 1 (${limitZone1}m)`}
              x={24}
              y={habourY - getDrawingDistance(limitZone1) + 6}
              fontSize={15}
              fill="#53A1F5"
              fontStyle="bold"
              align="center"
            />
          </Group>

          <Group name="limit-zone-2" visible={limitZone2 !== null}>
            <Line
              points={[
                0,
                habourY - getDrawingDistance(limitZone2),
                width,
                habourY - getDrawingDistance(limitZone2),
              ]}
              stroke="#53A1F5"
              strokeWidth={2}
            />

            <Text
              text={`${t("berth:general_information.ZONE")} 2 (${limitZone2}m)`}
              x={24}
              y={habourY - getDrawingDistance(limitZone2) + 6}
              fontSize={15}
              fill="#53A1F5"
              fontStyle="bold"
              align="center"
            />
          </Group>

          <Group name="limit-zone-3" visible={limitZone3 !== null}>
            <Line
              points={[
                0,
                habourY - getDrawingDistance(limitZone3),
                width,
                habourY - getDrawingDistance(limitZone3),
              ]}
              stroke="#53A1F5"
              strokeWidth={2}
            />

            <Text
              text={`${t("berth:general_information.ZONE")} 3 (${limitZone3}m)`}
              x={24}
              y={habourY - getDrawingDistance(limitZone3) + 6}
              fontSize={15}
              fill="#53A1F5"
              fontStyle="bold"
              align="center"
            />
          </Group>
        </Group>

        <Group visible={isShipVisible}>
          <Ship
            x={startX}
            y={startY - shipWidth - 3}
            width={shipRectWidth}
            height={shipRectHeight}
            angle={(theta * 180) / Math.PI}
            direction={shipDirection}
          />
        </Group>

        <Group name="habour">
          <Rect
            width={habourWidth}
            height={habourHeight}
            x={habourX}
            y={habourY}
            fill="#D9D9D9"
            stroke="#727272"
          />
        </Group>

        <Group name="sensor-left" visible={gettingRTData}>
          <Rect
            width={SENSOR_WIDTH}
            height={SENSOR_HEIGHT}
            cornerRadius={6}
            x={habourX + getDrawingDistance(distanceToLeft)}
            y={sensorY}
            fill="#000"
          />

          <Circle
            x={habourX + getDrawingDistance(distanceToLeft) + SENSOR_WIDTH / 2}
            y={sensorY + 10}
            // fill="white"
            radius={SENSOR_WIDTH / 5}
            fill={
              sensorAData?.status_id === NORMAL_STATUS_ID || !sensorAHasErrors
                ? "white"
                : AlarmStatusColor[sensorAData?.status_id]
            }
          />

          <Group name="sensor-left-detection-line" visible={gettingRTData}>
            <Line
              points={[
                habourX + getDrawingDistance(distanceToLeft) + SENSOR_WIDTH / 2,
                // habourY +
                // getDrawingDistance(distanceToFender) -
                habourY - getDrawingDistance(sensorAData?.distance),
                habourX + getDrawingDistance(distanceToLeft) + SENSOR_WIDTH / 2,
                // habourY + getDrawingDistance(distanceToFender),
                habourY,
              ]}
              stroke="#727272"
              strokeWidth={2}
              dash={[5, 5]}
            />

            <Circle
              x={
                habourX + getDrawingDistance(distanceToLeft) + SENSOR_WIDTH / 2
              }
              y={
                // habourY +
                // getDrawingDistance(distanceToFender) -
                habourY - getDrawingDistance(sensorAData?.distance)
              }
              fill="#727272"
              radius={4}
            />

            {/* <Text
              text={`${formatValue(sensorAData?.distance)} m`}
              x={
                habourX +
                getDrawingDistance(distanceToLeft) +
                SENSOR_WIDTH / 2 +
                12
              }
              y={
                habourY -
                getDrawingDistance(distanceToFender) -
                getDrawingDistance(sensorAData?.distance) / 2
              }
              fontSize={18}
              fill="#727272"
              fontStyle="bold"
              align="center"
            /> */}
          </Group>
        </Group>

        <Group name="sensor-right" visible={gettingRTData}>
          <Rect
            width={SENSOR_WIDTH}
            height={SENSOR_HEIGHT}
            cornerRadius={6}
            x={
              habourX +
              getDrawingDistance(distanceToLeft) +
              getDrawingDistance(sensorsDistance)
            }
            y={sensorY}
            fill="#000"
          />

          <Circle
            x={
              habourX +
              getDrawingDistance(distanceToLeft) +
              getDrawingDistance(sensorsDistance) +
              SENSOR_WIDTH / 2
            }
            y={sensorY + 10}
            // fill="white"
            radius={SENSOR_WIDTH / 5}
            fill={
              sensorBData?.status_id === NORMAL_STATUS_ID || !sensorBHasErrors
                ? "white"
                : AlarmStatusColor[sensorBData?.status_id]
            }
          />

          <Group name="sensor-right-detection-line" visible={gettingRTData}>
            <Line
              points={[
                habourX +
                  getDrawingDistance(distanceToLeft) +
                  getDrawingDistance(sensorsDistance) +
                  SENSOR_WIDTH / 2,
                // habourY +
                // getDrawingDistance(distanceToFender) -
                habourY - getDrawingDistance(sensorBData?.distance),
                habourX +
                  getDrawingDistance(distanceToLeft) +
                  getDrawingDistance(sensorsDistance) +
                  SENSOR_WIDTH / 2,
                // habourY + getDrawingDistance(distanceToFender),
                habourY,
              ]}
              stroke="#727272"
              strokeWidth={2}
              dash={[5, 5]}
            />

            <Circle
              x={
                habourX +
                getDrawingDistance(distanceToLeft) +
                getDrawingDistance(sensorsDistance) +
                SENSOR_WIDTH / 2
              }
              y={
                // habourY +
                // getDrawingDistance(distanceToFender) -
                habourY - getDrawingDistance(sensorBData?.distance)
              }
              fill="#727272"
              radius={4}
            />

            {/* <Text
              text={`${formatValue(sensorBData?.distance)} m`}
              x={
                habourX +
                getDrawingDistance(distanceToLeft) +
                getDrawingDistance(sensorsDistance) +
                SENSOR_WIDTH / 2 +
                12
              }
              y={
                habourY -
                getDrawingDistance(distanceToFender) -
                getDrawingDistance(sensorBData?.distance) / 2
              }
              fontSize={18}
              fill="#727272"
              fontStyle="bold"
              align="center"
            /> */}
          </Group>
        </Group>
      </Layer>
    </Stage>
  );
};
