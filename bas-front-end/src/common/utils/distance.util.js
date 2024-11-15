export const customParseFloat = (number) => {
  if (isNaN(parseFloat(number)) === false) {
    let toFixedLength = 0;
    let str = String(number);

    ["."].forEach((seperator) => {
      let arr = str.split(seperator);
      if (arr.length === 2) {
        toFixedLength = arr[1].length;
      }
    });
    if (toFixedLength > 6) toFixedLength = 6;
    if (str[str.length - 1] === ".") return str;
    return parseFloat(parseFloat(str).toFixed(toFixedLength));
  }

  return number;
};
