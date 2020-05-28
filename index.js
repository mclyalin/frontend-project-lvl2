import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const getChanges = (before, after) => {
  const keys = _.union(Object.keys(before), Object.keys(after));
  return keys
    .map((key) => {
      if (!_.has(before, key) && _.has(after, key)) {
        return `+ ${key}: ${after[key]}`;
      }
      if (_.has(before, key) && !_.has(after, key)) {
        return `- ${key}: ${before[key]}`;
      }
      if (before[key] === after[key]) {
        return `  ${key}: ${before[key]}`;
      }
      return [`- ${key}: ${before[key]}`, `+ ${key}: ${after[key]}`];
    }, '')
    .flat();
};

export default (filepath1, filepath2) => {
  const fileData1 = fs.readFileSync(path.resolve(filepath1), 'utf8');
  const fileData2 = fs.readFileSync(path.resolve(filepath2), 'utf8');

  const before = JSON.parse(fileData1);
  const after = JSON.parse(fileData2);
  const changes = getChanges(before, after);
  return `{\n${changes.join('\n')}\n}`;
};
