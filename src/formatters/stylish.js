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

const makeStylish = (tree, depth = 0) => {
  const result = tree
    .map((item) => {
      const {
        type, key, valueBefore, valueAfter, children,
      } = item;
      const newDepth = depth + 1;
      switch (type) {
        case 'node':
          return buildString(
            ' ', key, makeStylish(children, newDepth), newDepth,
          );
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
  return ['{', '\n', result, '\n', shift, '}'].join('');
};

export default makeStylish;
