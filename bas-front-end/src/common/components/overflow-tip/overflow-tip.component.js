import React, { useRef, useEffect, useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";

export const OverflowTip = (props) => {
  const textElementRef = useRef();
  const [hoverStatus, setHover] = useState(false);

  useEffect(() => {
    compareSize();
    window.addEventListener("resize", compareSize);
  }, []);

  useEffect(
    () => () => {
      window.removeEventListener("resize", compareSize);
    },
    []
  );

  const compareSize = () => {
    const compare =
      textElementRef.current.scrollWidth > textElementRef.current.clientWidth;
    setHover(compare);
  };

  return (
    <Tooltip
      title={props.value}
      interactive
      disableHoverListener={!hoverStatus}
      placement="top-start"
    >
      <div
        ref={textElementRef}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {props.children}
      </div>
    </Tooltip>
  );
};
