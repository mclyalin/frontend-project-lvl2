import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './src/parsers.js';
import format from './src/formatters.js';

const getFileData = (filepath) => (
  fs.readFileSync(path.resolve(filepath), 'utf-8')
);

const getFileFormat = (filepath) => (
  path.extname(filepath).slice(1)
);

const getChanges = (original, modified) => {
  const keys = _.union(Object.keys(original), Object.keys(modified));
  return keys.map((key) => {
    if (_.isObject(original[key]) && _.isObject(modified[key])) {
      return [[' ', key, getChanges(original[key], modified[key])]];
    }
    const originalValue = _.isObject(original[key])
      ? getChanges(original[key], original[key])
      : original[key];

    const modifiedValue = _.isObject(modified[key])
      ? getChanges(modified[key], modified[key])
      : modified[key];

    if (_.has(original, key) && !_.has(modified, key)) {
      return [['-', key, originalValue]];
    }
    if (!_.has(original, key) && _.has(modified, key)) {
      return [['+', key, modifiedValue]];
    }
    if (originalValue !== modifiedValue) {
      return [['-', key, originalValue], ['+', key, modifiedValue]];
    }
    return [[' ', key, originalValue]];
  }).flat();
};

export default (filepath1, filepath2, outputFormat) => {
  const data1 = getFileData(filepath1);
  const inputFormat1 = getFileFormat(filepath1);
  const original = parse(data1, inputFormat1);

  const data2 = getFileData(filepath2);
  const inputFormat2 = getFileFormat(filepath2);
  const modified = parse(data2, inputFormat2);

  const changes = getChanges(original, modified);
  return format(changes, outputFormat);
};
