import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './src/parsers.js';

const getFileData = (filepath) => (
  fs.readFileSync(path.resolve(filepath), 'utf-8')
);

const getFileFormat = (filepath) => (
  path.extname(filepath).slice(1)
);

const getChanges = (original, modified) => {
  const keys = _.union(Object.keys(original), Object.keys(modified));
  return keys
    .map((key) => {
      if (!_.has(original, key) && _.has(modified, key)) {
        return `+ ${key}: ${modified[key]}`;
      }
      if (_.has(original, key) && !_.has(modified, key)) {
        return `- ${key}: ${original[key]}`;
      }
      if (original[key] === modified[key]) {
        return `  ${key}: ${original[key]}`;
      }
      return [`- ${key}: ${original[key]}`, `+ ${key}: ${modified[key]}`];
    }, '')
    .flat();
};

export default (filepath1, filepath2) => {
  const data1 = getFileData(filepath1);
  const format1 = getFileFormat(filepath1);
  const original = parse(data1, format1);

  const data2 = getFileData(filepath2);
  const format2 = getFileFormat(filepath2);
  const modified = parse(data2, format2);

  const changes = getChanges(original, modified);
  return `{\n${changes.join('\n')}\n}`;
};
