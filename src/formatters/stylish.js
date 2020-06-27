import _ from 'lodash';

const calcIndent = (depth) => {
  const initIndent = 4;
  return initIndent * depth;
};

const buildString = (sign, key, value, depth) => {
  const indentSize = calcIndent(depth);
  const prefix = `${sign} `.padStart(indentSize);
  if (!_.isPlainObject(value)) {
    return `${prefix}${key}: ${value}`;
  }
  const formattedValue = Object.entries(value)
    .map(([iKey, iValue]) => buildString(' ', iKey, iValue, depth + 1))
    .join('\n');
  const shift = ' '.repeat(indentSize);
  return `${prefix}${key}: {\n${formattedValue}\n${shift}}`;
};

const makeStylish = (tree) => {
  const iter = (data, depth) => {
    const newDepth = depth + 1;
    const formattedData = data
      .map((item) => {
        const {
          type, key, valueBefore, valueAfter, children,
        } = item;
        switch (type) {
          case 'node':
            return buildString(' ', key, iter(children, newDepth), newDepth);
          case 'deleted':
            return buildString('-', key, valueBefore, newDepth);
          case 'added':
            return buildString('+', key, valueAfter, newDepth);
          case 'changed':
            return [
              buildString('-', key, valueBefore, newDepth),
              buildString('+', key, valueAfter, newDepth),
            ].join('\n');
          case 'unchanged':
            return buildString(' ', key, valueBefore, newDepth);
          default:
            throw new Error(`Unknown type: '${type}'!`);
        }
      })
      .join('\n');
    const shift = ' '.repeat(calcIndent(depth));
    return `{\n${formattedData}\n${shift}}`;
  };
  return iter(tree, 0);
};

export default makeStylish;
