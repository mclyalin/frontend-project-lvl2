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
    const firstPart = ['Property ', pathToKey, ' was ', type].join('');
    switch (type) {
      case 'node':
        return makePlain(children, updatedParents);
      case 'deleted':
        return firstPart;
      case 'added':
        return [firstPart, ' with ', format(valueAfter)].join('');
      case 'changed':
        return [
          firstPart, ' from ', format(valueBefore), ' to ', format(valueAfter),
        ].join('');
      default:
        return null;
    }
  })
  .filter((v) => v)
  .join('\n');

export default makePlain;
