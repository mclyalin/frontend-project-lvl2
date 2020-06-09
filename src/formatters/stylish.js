const getSign = (type) => {
  const types = {
    added: '+',
    deleted: '-',
    unchanged: ' ',
  };
  return types[type];
};

const printObject = (arr, shiftSize = 0) => {
  const printField = (indentSize, sign, key, value) => {
    const prefix = sign.concat(' ').padStart(indentSize);
    return Array.isArray(value)
      ? prefix.concat(key, ': ', printObject(value, indentSize))
      : prefix.concat(key, ': ', value);
  };

  const shift = ' '.repeat(shiftSize);
  const result = arr
    .map((item) => {
      const newShiftSize = shiftSize + 4;
      const { type, key, value } = item;
      if (type === 'changed') {
        const { oldValue } = item;
        const sign1 = getSign('deleted');
        const sign2 = getSign('added');
        const firstPart = printField(newShiftSize, sign1, key, oldValue);
        const lastPart = printField(newShiftSize, sign2, key, value);
        return [firstPart, lastPart].join('\n');
      }
      const sign = getSign(type);
      return printField(newShiftSize, sign, key, value);
    })
    .join('\n');
  return '{'.concat('\n', result, '\n', shift, '}');
};

export default printObject;
