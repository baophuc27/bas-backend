export const formatValue = (value) => {
  if (
    typeof value !== "undefined" &&
    !isNaN(value) &&
    value !== "" &&
    value !== null
  ) {
    return value?.toFixed(2);
  }

  return "--";
};

export const getUnit = (type) => {
  // eslint-disable-next-line default-case
  switch (type?.toUpperCase()) {
    case "DISTANCE":
      return " m";

    case "ANGLE":
      return "°";

    case "SPEED":
      return "cm/s";
  }
};
