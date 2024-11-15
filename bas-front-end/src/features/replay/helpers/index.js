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
