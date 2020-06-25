import _ from 'lodash';

const format = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (_.isString(value)) {
    return `'${value}'`;
  }
  return value;
};

const makePlain = (tree) => {
  const iter = (data, keys) => data
    .map((item) => {
      const {
        type, key, valueBefore, valueAfter, children,
      } = item;
      const updatedKeys = [...keys, key];
      const pathToKey = updatedKeys.join('.');
      switch (type) {
        case 'node':
          return iter(children, updatedKeys);
        case 'deleted':
          return `Property ${pathToKey} was ${type}`;
        case 'added':
          return `Property ${pathToKey} was ${type} with ${format(valueAfter)}`;
        case 'changed':
          return `Property ${pathToKey} was ${type} from ${format(valueBefore)} to ${format(valueAfter)}`;
        case 'unchanged':
          return null;
        default:
          throw new Error(`Unknown type: '${type}'!`);
      }
    })
    .filter(_.identity)
    .join('\n');
  return iter(tree, []);
};

export default makePlain;
