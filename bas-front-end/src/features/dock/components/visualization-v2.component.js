import {
  mapSensorStatusText,
  sensorStatusColor,
} from "common/constants/berth.constant";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Circle, Group, Layer, Line, Rect, Stage, Text } from "react-konva";
import { Ship } from "./ship.component";

const HABOUR_WIDTH = 240;
const HABOUR_HEIGHT = 30;
const SENSOR_WIDTH = 24;
const SENSOR_HEIGHT = 24;

const LEFT_TOOLTIP_PADDING = 8;
const RIGHT_TOOLTIP_PADDING = 8;
const TOOLTIP_LETTER_WIDTH = 7;

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

// Update
// Distance = distance from fender
// => Visualized distance = habourY - actual distance value
export const VisualizationV2 = ({
  width,
  height,
  zoom = 1,
  limitZone1 = null,
  limitZone2 = null,
  limitZone3 = null,
  distanceToFender,
  distanceToLeft,
  sensorsDistance,
  sensorAData,
  sensorBData,
  shipLength = 176,
  gettingRTData = false,
  isMooring = false,
  sensorAHasErrors = false,
  sensorBHasErrors = false,
  shipDirection = "right",
  sensorErrors = {},
  isShipVisible = false,
}) => {
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  const [leftError, setLeftError] = useState({});
  const [rightError, setRightError] = useState({});

  const [showsLeftTooltip, setShowsLeftTooltip] = useState(false);
  const [showsRightTooltip, setShowsRightTooltip] = useState(false);

  const getDrawingDistance = (actualDistance) => {
    return ((actualDistance * width) / HABOUR_WIDTH) * zoom;
  };

  const habourWidth = getDrawingDistance(HABOUR_WIDTH);
  const habourHeight = getDrawingDistance(HABOUR_HEIGHT);

  const habourX = (width - habourWidth) / 2;
  const habourY = height - 170; // hud height

  const shipWidth = (getDrawingDistance(shipLength) * 93) / 643;

  const hasDeviceErrors = sensorAHasErrors || sensorBHasErrors;

  const leftSensorX = habourX + getDrawingDistance(distanceToLeft);
  const leftTooltipWidth =
    LEFT_TOOLTIP_PADDING +
    leftError?.length * TOOLTIP_LETTER_WIDTH +
    RIGHT_TOOLTIP_PADDING;
  const leftTooltipX = leftSensorX - leftTooltipWidth - LEFT_TOOLTIP_PADDING;

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

  useEffect(() => {
    if ("right_sensor" in sensorErrors) {
      setRightError(sensorErrors?.right_sensor);
      setShowsRightTooltip(true);
    } else {
      setRightError({});
      setShowsRightTooltip(false);
    }

    if ("left_sensor" in sensorErrors) {
      setLeftError(sensorErrors?.left_sensor);
      setShowsLeftTooltip(true);
    } else {
      setLeftError({});
      setShowsLeftTooltip(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sensorErrors]);

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
            y={habourY + getDrawingDistance(distanceToFender)}
            fill="#000"
          />

          <Circle
            x={habourX + getDrawingDistance(distanceToLeft) + SENSOR_WIDTH / 2}
            y={
              habourY + getDrawingDistance(distanceToFender) + SENSOR_WIDTH / 2
            }
            // fill="white"
            radius={SENSOR_WIDTH / 5}
            // fill={
            //   sensorAData?.status_id === NORMAL_STATUS_ID || !sensorAHasErrors
            //     ? "white"
            //     : AlarmStatusColor[sensorAData?.status_id]
            // }
            fill={sensorStatusColor(leftError) || "white"}
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
          <Group
            name="right-device-box"
            onMouseEnter={(e) => {}}
            onMouseLeave={() => {}}
          >
            <Rect
              width={SENSOR_WIDTH}
              height={SENSOR_HEIGHT}
              cornerRadius={6}
              x={
                habourX +
                getDrawingDistance(distanceToLeft) +
                getDrawingDistance(sensorsDistance)
              }
              y={habourY + getDrawingDistance(distanceToFender)}
              fill="#000"
            />

            <Circle
              x={
                habourX +
                getDrawingDistance(distanceToLeft) +
                getDrawingDistance(sensorsDistance) +
                SENSOR_WIDTH / 2
              }
              y={
                habourY +
                getDrawingDistance(distanceToFender) +
                SENSOR_WIDTH / 2
              }
              // fill="white"
              radius={SENSOR_WIDTH / 5}
              // fill={
              //   sensorBData?.status_id === NORMAL_STATUS_ID || !sensorBHasErrors
              //     ? "white"
              //     : AlarmStatusColor[sensorBData?.status_id]
              // }
              fill={sensorStatusColor(rightError) || "white"}
            />
          </Group>

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

      <Tooltip
        name="right-sensor-tooltip"
        x={
          habourX +
          getDrawingDistance(distanceToLeft) +
          getDrawingDistance(sensorsDistance) +
          SENSOR_WIDTH +
          LEFT_TOOLTIP_PADDING
        }
        y={habourY + getDrawingDistance(distanceToFender)}
        height={SENSOR_HEIGHT}
        text={t(mapSensorStatusText(rightError))}
        arrow="left"
        visible={showsRightTooltip && gettingRTData}
      />

      <Tooltip
        name="left-sensor-tooltip"
        x={leftTooltipX}
        y={habourY + getDrawingDistance(distanceToFender)}
        height={SENSOR_HEIGHT}
        text={t(mapSensorStatusText(leftError))}
        arrow="right"
        visible={showsLeftTooltip && gettingRTData}
      />
    </Stage>
  );
};

const Tooltip = ({ visible = true, x, y, height, text, arrow = "none" }) => {
  const tooltipWidth =
    LEFT_TOOLTIP_PADDING +
    text?.length * TOOLTIP_LETTER_WIDTH +
    RIGHT_TOOLTIP_PADDING;

  if (!visible) {
    return null;
  }

  return (
    <Layer>
      <Group>
        <Rect
          x={x}
          y={y}
          width={tooltipWidth}
          height={height}
          fill="rgba(0, 0, 0, 0.7)"
          cornerRadius={5}
        />

        {arrow === "right" && (
          <Line
            points={[
              // Tip of the arrow
              x + tooltipWidth + 5,
              y + height / 2,

              // Bottom right of the arrow
              x + tooltipWidth,
              y + height / 2 + 5,

              // Top right of the arrow
              x + tooltipWidth,
              y + height / 2 - 5,
            ]}
            fill="rgba(0, 0, 0, 0.7)"
            closed
          />
        )}

        {arrow === "left" && (
          <Line
            points={[
              // Tip of the arrow
              x - 5,
              y + height / 2,

              // Bottom left of the arrow
              x,
              y + height / 2 + 5,

              // Top left of the arrow
              x,
              y + height / 2 - 5,
            ]}
            fill="rgba(0, 0, 0, 0.7)"
            closed
          />
        )}

        <Text
          text={text}
          x={x + LEFT_TOOLTIP_PADDING}
          y={y + (height - 12) / 2}
          fontSize={12}
          fill="white"
          align="center"
          width={tooltipWidth - LEFT_TOOLTIP_PADDING - RIGHT_TOOLTIP_PADDING}
        />
      </Group>
    </Layer>
  );
};
