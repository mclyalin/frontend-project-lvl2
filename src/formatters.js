const makeStylish = (data, shiftSize = 0) => {
  const shift = ' '.repeat(shiftSize);
  const result = data
    .map((item) => {
      const { sign, key, value } = item;
      const newShiftSize = shiftSize + 4;
      const prefix = sign.concat(' ').padStart(newShiftSize);
      if (Array.isArray(value)) {
        return prefix.concat(key, ': ', makeStylish(value, newShiftSize));
      }
      return prefix.concat(key, ': ', value);
    })
    .join('\n');
  return '{'.concat('\n', result, '\n', shift, '}');
};

const formatters = {
  stylish: makeStylish,
};

export default (data, outputFormat) => formatters[outputFormat](data);
