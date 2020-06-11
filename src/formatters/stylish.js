import _ from 'lodash';

const getSign = (type) => {
  const signs = {
    added: '+',
    deleted: '-',
    unchanged: ' ',
  };
  return signs[type];
};

const formatObject = (obj) => (
  Object.entries(obj).map(([key, value]) => {
    const type = 'unchanged';
    return { type, key, value };
  })
);

const printProperty = (type, key, value, indentSize) => {
  const sign = getSign(type);
  const prefix = [sign, ' '].join('').padStart(indentSize);
  return [prefix, key, ': ', value].join('');
};

const printObject = (arr, shiftSize = 0) => {
  const stringify = (value, indentSize) => {
    if (_.isPlainObject(value)) {
      const formattedValue = formatObject(value);
      return printObject(formattedValue, indentSize);
    }
    if (Array.isArray(value)) {
      return printObject(value, indentSize);
    }
    return value;
  };

  const shift = ' '.repeat(shiftSize);
  const result = arr
    .map((item) => {
      const newShiftSize = shiftSize + 4;
      const { type, key } = item;
      if (type === 'node') {
        const { children } = item;
        const childrenStr = stringify(children, newShiftSize);
        return printProperty('unchanged', key, childrenStr, newShiftSize);
      }
      if (type === 'changed') {
        const { value, oldValue } = item;
        const valueStr = stringify(value, newShiftSize);
        const oldValueStr = stringify(oldValue, newShiftSize);
        const firstStr = printProperty('deleted', key, oldValueStr, newShiftSize);
        const lastStr = printProperty('added', key, valueStr, newShiftSize);
        return [firstStr, lastStr].join('\n');
      }
      const { value } = item;
      const valueStr = stringify(value, newShiftSize);
      return printProperty(type, key, valueStr, newShiftSize);
    })
    .join('\n');
  return ['{', '\n', result, '\n', shift, '}'].join('');
};

export default printObject;
