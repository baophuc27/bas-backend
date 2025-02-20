import {
  mapSensorStatusText,
  sensorStatusColorDock,
} from "common/constants/berth.constant";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Circle, Group, Layer, Line, Rect, Stage, Text } from "react-konva";
import { Ship } from "./ship.component";

// Update these constants to be base values that will be scaled
const HABOUR_WIDTH = 78;
const HABOUR_HEIGHT = 12;
const SENSOR_BASE_WIDTH = 4;
const SENSOR_BASE_HEIGHT = 4;

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
  shipLength = 100,
  gettingRTData = false,
  isMooring = false,
  sensorAHasErrors = false,
  sensorBHasErrors = false,
  shipDirection = "right",
  sensorErrors = {},
  isShipVisible = false,
  sidebarCollapsed = false,
}) => {
  // Add state for vertical position
  const [harbourUpPosition, setHarbourUpPosition] = useState(0);
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
    return ((actualDistance * width) / HABOUR_WIDTH) * zoom * 0.8;
  };

  const drawingWidth = width;

  const habourWidth = getDrawingDistance(HABOUR_WIDTH);
  const habourHeight = getDrawingDistance(HABOUR_HEIGHT);

  const habourX = (drawingWidth - habourWidth) / 2;
  // height of hud
  const habourY = height - 170;

  const shipWidth = (getDrawingDistance(shipLength) * 93) / 643;

  const hasDeviceErrors = sensorAHasErrors || sensorBHasErrors;

  const [leftRectX, setLeftRectX] = useState(0);
  const [rightRectX, setRightRectX] = useState(0);

  // Calculate sensor positions based on distanceToLeft and sensorsDistance
  const leftSensorX = habourX + getDrawingDistance(distanceToLeft);
  const rightSensorX = leftSensorX + getDrawingDistance(sensorsDistance);

  // Calculate sensor Y positions using distanceToFender
  const sensorY = harbourUpPosition - getDrawingDistance(distanceToFender);

  // Calculate scaled sensor dimensions
  const sensorWidth = getDrawingDistance(SENSOR_BASE_WIDTH);
  const sensorHeight = getDrawingDistance(SENSOR_BASE_HEIGHT);

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
    xA: leftSensorX + sensorWidth / 2,
    yA: habourY - getDrawingDistance(sensorAData?.distance),
    xD: rightSensorX + sensorWidth / 2,
    yD: habourY - getDrawingDistance(sensorBData?.distance),
    rectHeight: shipWidth,
    offsetA:
      (getDrawingDistance(shipLength) - getDrawingDistance(sensorsDistance)) /
      2,
    offsetD:
      (getDrawingDistance(shipLength) - getDrawingDistance(sensorsDistance)) /
      2,
  });

  function Harbour({ x, y, width, height }) {
    const sideRectWidth = height;
    const sideRectHeight = height * 0.6;
    const middleRectWidth = height * 0.3;
    const middleRectHeight = height * 0.4;
    const centerRectWidth = height * 1.5;
    const centerRectHeight = height * 1.5;

    const totalRectanglesWidth =
      2 * sideRectWidth + 2 * middleRectWidth + centerRectWidth;

    const totalGapSpace = width - totalRectanglesWidth;

    const gaps = {
      gap1: totalGapSpace * 0.4,
      gap2: totalGapSpace * 0.1,
      gap3: totalGapSpace * 0.1,
      gap4: totalGapSpace * 0.4,
    };

    // Position rectangles
    const square1X = x;
    const square2X = square1X + sideRectWidth + gaps.gap1;
    const centerX = square2X + middleRectWidth + gaps.gap2;
    const square4X = centerX + centerRectWidth + gaps.gap3;
    const square5X = square4X + middleRectWidth + gaps.gap4;

    const leftSideMiddleX = square1X + sideRectWidth / 2;
    const rightSideMiddleX = square5X + sideRectWidth / 2;

    const baseY = y + height;
    const upPosition = baseY - centerRectHeight;

    // Passing line adjustments
    const passingLineHeight = height * 0.15;
    const passingLineWidth = rightSideMiddleX - leftSideMiddleX;
    const passingLineY = upPosition + sideRectHeight * 0.5;
    const passingLineX = leftSideMiddleX;

    // Hypotenuse calculations
    const angle = -30;
    const angleInRadians = (angle * Math.PI) / 180;
    const hypotenuseLine = passingLineWidth;
    const leftStartX = passingLineX;
    const leftStartY = passingLineY;
    const leftEndX = leftStartX - hypotenuseLine * Math.cos(angleInRadians);
    const leftEndY = leftStartY - hypotenuseLine * Math.sin(angleInRadians);

    const rightStartX = leftSideMiddleX + passingLineWidth;
    const rightStartY = passingLineY;
    const rightEndX = rightStartX + hypotenuseLine * Math.cos(angleInRadians);
    const rightEndY = rightStartY - hypotenuseLine * Math.sin(angleInRadians);

    useEffect(() => {
      setLeftRectX(square1X);
      setRightRectX(square5X + sideRectWidth);
      setHarbourUpPosition(y);
    }, [square1X, square5X, sideRectWidth, y]);

    return (
      <Group name="harbour-squares">
        <Line
          name="left-hypotenuse-border"
          points={[leftStartX, leftStartY, leftEndX, leftEndY]}
          stroke="#727272"
          strokeWidth={passingLineHeight + 2}
          lineCap="round"
        />
        <Line
          name="left-hypotenuse"
          points={[leftStartX, leftStartY, leftEndX, leftEndY]}
          stroke="#B8B8B8"
          strokeWidth={passingLineHeight}
          lineCap="round"
        />
        <Line
          name="right-hypotenuse-border"
          points={[rightStartX, rightStartY, rightEndX, rightEndY]}
          stroke="#727272"
          strokeWidth={passingLineHeight + 2}
          lineCap="round"
        />
        <Line
          name="right-hypotenuse"
          points={[rightStartX, rightStartY, rightEndX, rightEndY]}
          stroke="#B8B8B8"
          strokeWidth={passingLineHeight}
          lineCap="round"
        />

        {/* Passing line */}
        <Rect
          name="passing-line"
          width={passingLineWidth}
          height={passingLineHeight}
          x={passingLineX}
          y={passingLineY}
          fill="#B8B8B8"
          stroke="#727272"
          strokeWidth={1}
        />

        {/* Harbor rectangles */}
        <Rect
          width={sideRectWidth}
          height={sideRectHeight}
          x={square1X}
          y={upPosition}
          fill="#D9D9D9"
          stroke="#727272"
        />
        <Rect
          width={middleRectWidth}
          height={middleRectHeight}
          x={square2X}
          y={upPosition + 5}
          fill="#D9D9D9"
          stroke="#727272"
        />
        <Rect
          width={centerRectWidth}
          height={centerRectHeight}
          x={centerX}
          y={upPosition}
          fill="#D9D9D9"
          stroke="#727272"
        />
        <Rect
          width={middleRectWidth}
          height={middleRectHeight}
          x={square4X}
          y={upPosition + 5}
          fill="#D9D9D9"
          stroke="#727272"
        />
        <Rect
          width={sideRectWidth}
          height={sideRectHeight}
          x={square5X}
          y={upPosition}
          fill="#D9D9D9"
          stroke="#727272"
        />
      </Group>
    );
  }

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
    <Stage width={drawingWidth} height={height}>
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
          <Harbour
            x={habourX}
            y={habourY}
            width={habourWidth}
            height={habourHeight}
          />
        </Group>
        <Group name="sensor-left" visible={gettingRTData}>
          <Rect
            width={sensorWidth}
            height={sensorHeight}
            cornerRadius={6}
            x={leftSensorX}
            y={sensorY}
            fill="#000"
          />

          <Circle
            x={leftSensorX + sensorWidth / 2}
            y={sensorY + sensorHeight / 2}
            radius={sensorWidth / 5}
            fill={sensorStatusColorDock(leftError) || "white"}
          />

          <Group name="sensor-left-detection-line" visible={gettingRTData}>
            <Line
              points={[
                leftSensorX + sensorWidth / 2,
                sensorY - getDrawingDistance(sensorAData?.distance),
                leftSensorX + sensorWidth / 2,
                sensorY,
              ]}
              stroke="#727272"
              strokeWidth={2}
              dash={[5, 5]}
            />

            <Circle
              x={leftSensorX + sensorWidth / 2}
              y={sensorY - getDrawingDistance(sensorAData?.distance)}
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
              width={sensorWidth}
              height={sensorHeight}
              cornerRadius={6}
              x={rightSensorX}
              y={sensorY}
              fill="#000"
            />

            <Circle
              x={rightSensorX + sensorWidth / 2}
              y={sensorY + sensorHeight / 2}
              radius={sensorWidth / 5}
              fill={sensorStatusColorDock(rightError) || "white"}
            />
          </Group>

          <Group name="sensor-right-detection-line" visible={gettingRTData}>
            <Line
              points={[
                rightSensorX + sensorWidth / 2,
                sensorY - getDrawingDistance(sensorBData?.distance),
                rightSensorX + sensorWidth / 2,
                sensorY,
              ]}
              stroke="#727272"
              strokeWidth={2}
              dash={[5, 5]}
            />

            <Circle
              x={rightSensorX + sensorWidth / 2}
              y={sensorY - getDrawingDistance(sensorBData?.distance)}
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
        x={rightSensorX + sensorWidth + LEFT_TOOLTIP_PADDING}
        y={sensorY}
        height={sensorHeight}
        text={t(mapSensorStatusText(rightError))}
        arrow="left"
        visible={showsRightTooltip && gettingRTData}
      />

      <Tooltip
        name="left-sensor-tooltip"
        x={leftTooltipX}
        y={sensorY}
        height={sensorHeight}
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
