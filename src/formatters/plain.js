const check = (value) => {
  if (Array.isArray(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const printObject = (arr, parents = []) => arr
  .map((item) => {
    const { type, key, value } = item;
    const updatedParents = [...parents, key];
    if (type === 'unchanged') {
      return Array.isArray(value)
        ? printObject(value, updatedParents)
        : null;
    }
    const pathToKey = updatedParents.join('.');
    const firstPart = `Property ${pathToKey} was ${type}`;
    if (type === 'added') {
      return firstPart.concat(' with ', check(value));
    }
    if (type === 'changed') {
      const { oldValue } = item;
      return firstPart.concat(' from ', check(oldValue), ' to ', check(value));
    }
    return firstPart;
  })
  .filter((v) => v)
  .join('\n');

export default printObject;
