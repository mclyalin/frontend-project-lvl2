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
    const originalValue = original[key];
    const modifiedValue = modified[key];
    if (_.isPlainObject(originalValue) && _.isPlainObject(modifiedValue)) {
      const children = getChanges(originalValue, modifiedValue);
      return { type: 'node', key, children };
    }
    if (!_.has(original, key)) {
      return { type: 'added', key, value: modifiedValue };
    }
    if (!_.has(modified, key)) {
      return { type: 'deleted', key, value: originalValue };
    }
    if (originalValue !== modifiedValue) {
      return {
        type: 'changed',
        key,
        value: modifiedValue,
        oldValue: originalValue,
      };
    }
    return { type: 'unchanged', key, value: originalValue };
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
