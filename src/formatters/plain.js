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

const makePlain = (tree, parents = []) => tree
  .map((item) => {
    const {
      type, key, valueBefore, valueAfter, children,
    } = item;
    const updatedParents = [...parents, key];
    const pathToKey = updatedParents.join('.');
    switch (type) {
      case 'node':
        return makePlain(children, updatedParents);
      case 'deleted':
        return [
          'Property ', pathToKey, ' was ', type,
        ].join('');
      case 'added':
        return [
          'Property ', pathToKey, ' was ', type,
          ' with ', format(valueAfter),
        ].join('');
      case 'changed':
        return [
          'Property ', pathToKey, ' was ', type,
          ' from ', format(valueBefore), ' to ', format(valueAfter),
        ].join('');
      case 'unchanged':
        return null;
      default:
        throw new Error(`Unknown type: '${type}'!`);
    }
  })
  .filter((v) => v)
  .join('\n');

export default makePlain;
