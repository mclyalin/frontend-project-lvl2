import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './src/parsers.js';
import format from './src/formatters/index.js';

const getFileData = (filepath) => (
  fs.readFileSync(path.resolve(filepath), 'utf-8')
);

const getFileExtension = (filepath) => (
  path.extname(filepath).slice(1)
);

const getChanges = (original, modified) => {
  const keys = _.union(Object.keys(original), Object.keys(modified));
  return keys.map((key) => {
    if (_.isObject(original[key]) && _.isObject(modified[key])) {
      return {
        type: 'unchanged',
        key,
        value: getChanges(original[key], modified[key]),
      };
    }
    const originalValue = _.isObject(original[key])
      ? getChanges(original[key], original[key])
      : original[key];

    const modifiedValue = _.isObject(modified[key])
      ? getChanges(modified[key], modified[key])
      : modified[key];

    if (_.has(original, key) && !_.has(modified, key)) {
      return {
        type: 'deleted',
        key,
        value: originalValue,
      };
    }
    if (!_.has(original, key) && _.has(modified, key)) {
      return {
        type: 'added',
        key,
        value: modifiedValue,
      };
    }
    if (originalValue !== modifiedValue) {
      return {
        type: 'changed',
        key,
        value: modifiedValue,
        oldValue: originalValue,
      };
    }
    return {
      type: 'unchanged',
      key,
      value: originalValue,
    };
  });
};


export default (filepath1, filepath2, outputFormat) => {
  const data1 = getFileData(filepath1);
  const extension1 = getFileExtension(filepath1);
  const original = parse(data1, extension1);

  const data2 = getFileData(filepath2);
  const extension2 = getFileExtension(filepath2);
  const modified = parse(data2, extension2);

  const changes = getChanges(original, modified);
  return format(changes, outputFormat);
};
