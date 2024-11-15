import { useMemo, useState } from "react";
import { Circle, Group, Layer, Line, Rect, Stage, Text } from "react-konva";

const HABOUR_ZONE_WIDTH = 300;
const SHIP_WIDTH = 150; // Chiều rộng tàu
const SHIP_LENGTH = 1000; // Chiều dài tàu
const HABOUR_WIDTH = 1800;
const SENSOR_A_DISTANCE_FROM_LEFT_SIDE = 300;
const DISTANCE_BETWEEN_SENSORS = 800;
const SENSOR_DISTANCE_FROM_FENDER = 15;
const SENSOR_SIZE = 42;
const MAX_SCALE = 0.5;

const ZONE_1_WIDTH = 250;
const ZONE_2_WIDTH = 200;
const ZONE_3_WIDTH = 150;

export const Visualization = ({
  width,
  height,
  sensorAData,
  sensorBData,
  angle,
  hasData,
}) => {
  const [stageScale, setStageScale] = useState(1);
  const [stageX, setStageX] = useState(0);
  const [stageY, setStageY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const sensorADistance = useMemo(() => {
    return sensorAData?.distance * 3;
  }, [sensorAData]);

  const sensorBDistance = useMemo(() => {
    return sensorBData?.distance * 3;
  }, [sensorBData]);

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();

    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    let newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    newScale = Math.max(MAX_SCALE, newScale);

    setStageScale(newScale);

    setStageX(
      -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
    );
    setStageY(
      -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    );
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPosition({
      x: e.evt.clientX,
      y: e.evt.clientY,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const dx = e.evt.clientX - startPosition.x;
      const dy = e.evt.clientY - startPosition.y;
      setStageX(stageX + dx);
      setStageY(stageY + dy);
      setStartPosition({
        x: e.evt.clientX,
        y: e.evt.clientY,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const BackgroundLayer = ({ width, height }) => {
    return (
      <Layer>
        <Rect
          x={-width}
          y={-height}
          width={width * 5}
          height={height * 5}
          fill="#78cfee"
        />
      </Layer>
    );
  };

  const Sensor = ({ x, y, width, height }) => {
    return (
      <Group x={x} y={y}>
        <Rect width={width} height={height} fill="#000" cornerRadius={10} />
        <Circle x={width / 2} y={height / 2} radius={5} fill="red" />
      </Group>
    );
  };

  const DockLayer = () => {
    const habourX = 0;
    const habourY = height - HABOUR_ZONE_WIDTH;

    const sensorAX = habourX + SENSOR_A_DISTANCE_FROM_LEFT_SIDE;
    const sensorAY = habourY + SENSOR_DISTANCE_FROM_FENDER;

    const sensorBX =
      habourX + SENSOR_A_DISTANCE_FROM_LEFT_SIDE + DISTANCE_BETWEEN_SENSORS;
    const sensorBY = habourY + SENSOR_DISTANCE_FROM_FENDER;

    const sensorAShipY =
      habourY -
      (sensorADistance - SENSOR_SIZE / 2 - SENSOR_DISTANCE_FROM_FENDER);

    const sensorBShipY =
      habourY -
      (sensorBDistance - SENSOR_SIZE / 2 - SENSOR_DISTANCE_FROM_FENDER);

    const shipX =
      sensorAX + SENSOR_SIZE / 2 - (SHIP_LENGTH - DISTANCE_BETWEEN_SENSORS) / 2;
    const shipY = sensorAShipY - SHIP_WIDTH / 2;

    return (
      <>
        <Layer>
          <Group>
            <Rect
              width={width * 5}
              height={ZONE_1_WIDTH}
              x={-width}
              y={habourY - ZONE_1_WIDTH}
              // fill="#52A5FA"
              stroke="#53A1F5"
            />

            <Text
              text={"VÙNG 1"}
              x={24}
              y={habourY - ZONE_1_WIDTH + 24}
              fontSize={20}
              fill="#9C9C9C"
              fontStyle="bold"
              align="center"
            />

            <Rect
              width={width * 5}
              height={ZONE_2_WIDTH}
              x={-width}
              y={habourY - ZONE_1_WIDTH - ZONE_2_WIDTH}
              // fill="#52A5FA"
              stroke="#53A1F5"
            />

            <Text
              text={"VÙNG 2"}
              x={24}
              y={habourY - ZONE_1_WIDTH - ZONE_2_WIDTH + 24}
              fontSize={20}
              fill="#9C9C9C"
              fontStyle="bold"
              align="center"
            />

            <Rect
              width={width * 5}
              height={ZONE_3_WIDTH}
              x={-width}
              y={habourY - ZONE_1_WIDTH - ZONE_2_WIDTH - ZONE_3_WIDTH}
              // fill="#52A5FA"
              stroke="#53A1F5"
            />

            <Text
              text={"VÙNG 3"}
              x={24}
              y={habourY - ZONE_1_WIDTH - ZONE_2_WIDTH - ZONE_3_WIDTH + 24}
              fontSize={20}
              fill="#9C9C9C"
              fontStyle="bold"
              align="center"
            />
          </Group>

          <Group>
            <Rect
              width={HABOUR_WIDTH}
              height={height - habourY}
              x={habourX}
              y={habourY}
              fill="#D9D9D9"
              stroke="#727272"
            />

            <Line
              points={[habourX, habourY, HABOUR_WIDTH, habourY]}
              stroke="#727272"
              strokeWidth={12}
              dash={[HABOUR_WIDTH / 10, 30]}
            />
          </Group>

          <Group>
            <Sensor
              x={sensorAX}
              y={sensorAY}
              width={SENSOR_SIZE}
              height={SENSOR_SIZE}
            />

            <Line
              points={[
                sensorAX + SENSOR_SIZE / 2,
                sensorAShipY,
                sensorAX + SENSOR_SIZE / 2,
                sensorAY,
              ]}
              stroke="#727272"
              strokeWidth={2}
              dash={[5, 5]}
              visible={hasData}
            />
          </Group>

          <Group>
            <Sensor
              x={sensorBX}
              y={sensorBY}
              width={SENSOR_SIZE}
              height={SENSOR_SIZE}
            />

            <Line
              points={[
                sensorBX + SENSOR_SIZE / 2,
                sensorBShipY,
                sensorBX + SENSOR_SIZE / 2,
                sensorBY,
              ]}
              stroke="#727272"
              strokeWidth={2}
              dash={[5, 5]}
              visible={hasData}
            />
          </Group>
        </Layer>

        <Layer visible={hasData}>
          <Rect
            width={SHIP_LENGTH}
            height={SHIP_WIDTH}
            x={shipX}
            y={shipY}
            fill="#EDFFFF"
            cornerRadius={99}
            stroke="#000"
            rotation={-angle}
          />
        </Layer>

        <Layer visible={hasData}>
          <Text
            text={sensorAData?.distance + "m"}
            x={sensorAX + 40}
            y={sensorAShipY + sensorADistance / 2}
            fontSize={18}
            fill="#727272"
            fontStyle="bold"
            align="center"
          />

          <Text
            text={sensorBData?.distance + "m"}
            x={sensorBX - 40}
            y={sensorBShipY + sensorBDistance / 2}
            fontSize={18}
            fill="#727272"
            fontStyle="bold"
            align="center"
          />
        </Layer>
      </>
    );
  };

  return (
    <Stage
      width={width}
      height={height}
      x={stageX}
      y={stageY}
      // scaleX={stageScale}
      // scaleY={stageScale}
      // onMouseDown={handleMouseDown}
      // onMouseMove={handleMouseMove}
      // onMouseUp={handleMouseUp}
      // onMouseLeave={handleMouseLeave}
      // onWheel={handleWheel}
    >
      <BackgroundLayer width={width} height={height} />
      {/* <DockLayer /> */}
    </Stage>
  );
};
