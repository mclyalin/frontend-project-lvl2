import _ from 'lodash';

const stingify = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (_.isString(value)) {
    return `'${value}'`;
  }
  return value;
};

const printObject = (arr, parents = []) => arr
  .map((item) => {
    const { type, key } = item;
    const updatedParents = [...parents, key];
    if (type === 'node') {
      const { children } = item;
      return printObject(children, updatedParents);
    }
    const pathToKey = updatedParents.join('.');
    const firstPart = ['Property ', pathToKey, ' was ', type].join('');
    if (type === 'deleted') {
      return firstPart;
    }
    if (type === 'added') {
      const { value } = item;
      const lastPart = [' with ', stingify(value)].join('');
      return [firstPart, lastPart].join('');
    }
    if (type === 'changed') {
      const { value, oldValue } = item;
      const lastPart = [
        ' from ', stingify(oldValue),
        ' to ', stingify(value),
      ].join('');
      return [firstPart, lastPart].join('');
    }
    return null;
  })
  .filter((v) => v)
  .join('\n');

export default printObject;
