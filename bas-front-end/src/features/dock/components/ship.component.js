import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";

export const Ship = ({ x, y, width, direction = "right", angle }) => {
  const [image] = useImage(`/images/ship-${direction}.svg`);

  return (
    <KonvaImage
      image={image}
      y={y}
      width={width}
      // height={height}
      height={(width * 93) / 643}
      x={x}
      rotation={angle}
    />
  );
};
