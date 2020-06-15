import _ from 'lodash';

const calcIndent = (depth, initIndent = 4) => depth * initIndent;

const format = (obj, depth) => {
  const indentSize = calcIndent(depth + 1);
  const result = Object.entries(obj)
    .map(([key, value]) => {
      const prefix = '  '.padStart(indentSize);
      return [prefix, key, ': ', value].join('');
    })
    .join('\n');
  const shift = ' '.repeat(calcIndent(depth));
  return ['{', '\n', result, '\n', shift, '}'].join('');
};

const buildString = (sign, key, value, depth) => {
  const indentSize = calcIndent(depth);
  const prefix = [sign, ' '].join('').padStart(indentSize);
  const formattedValue = _.isPlainObject(value)
    ? format(value, depth)
    : value;
  return [prefix, key, ': ', formattedValue].join('');
};

const makeStylish = (tree, depthCount = 0) => {
  const depth = depthCount + 1;
  const result = tree
    .map((item) => {
      const {
        type, key, valueBefore, valueAfter, children,
      } = item;
      switch (type) {
        case 'node':
          return buildString(' ', key, makeStylish(children, depth), depth);
        case 'deleted':
          return buildString('-', key, valueBefore, depth);
        case 'added':
          return buildString('+', key, valueAfter, depth);
        case 'changed':
          return [
            buildString('-', key, valueBefore, depth),
            buildString('+', key, valueAfter, depth),
          ].join('\n');
        default:
          return buildString(' ', key, valueBefore, depth);
      }
    })
    .join('\n');
  const shift = ' '.repeat(calcIndent(depth - 1));
  return ['{', '\n', result, '\n', shift, '}'].join('');
};

export default makeStylish;
