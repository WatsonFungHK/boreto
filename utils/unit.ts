export const isRealNumber = (value) => typeof value === 'number' && !Number.isNaN(value);

// ref: https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
// logic is reusable for formatting file size and monetary amount so it is extracted into here
export const formatNumberWithUnit = (number: number, decimalScale: number, sizeScale: number, units: Array<string>, delimiter = '') => {
  if (!isRealNumber(number) || number === 0) return '';
  const decimal = decimalScale < 0 ? 0 : decimalScale;
  const i = Math.floor(Math.log(number) / Math.log(sizeScale));

  return `${parseFloat((number / (sizeScale ** i)).toFixed(decimal))}${delimiter}${units[i]}`;
};

export const SIZE_UNITS = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
export const SIZE_SCALE = 1024; // = 2 ^ 10

export const formatFileSize = (sizeInByte: number, decimalScale: number) => {
  return formatNumberWithUnit(sizeInByte, decimalScale, SIZE_SCALE, SIZE_UNITS, ' ');
};