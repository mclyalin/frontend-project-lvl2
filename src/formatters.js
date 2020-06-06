const makeStylish = (data) => {
  const numOfSpaces = 4;
  const iter = (arr, acc, depth = 1) => {
    const [sign, key, value] = arr;
    const indentSize = numOfSpaces * depth;
    const indent = ' '.repeat(indentSize);
    const prefix = `${sign} `.padStart(indentSize);
    const firstPart = `${prefix}${key}: `;

    if (Array.isArray(value)) {
      return `${acc}${firstPart}{\n${value
        .reduce((iAcc, v) => iter(v, iAcc, depth + 1), '')}${indent}}\n`;
    }
    return `${acc}${firstPart}${value}\n`;
  };
  const result = data.reduce((acc, d) => iter(d, acc), '');
  return `{\n${result}}`;
};

const formatters = {
  stylish: makeStylish,
};

const format = (data, formatter) => formatters[formatter](data);

export { format as default, formatters };
