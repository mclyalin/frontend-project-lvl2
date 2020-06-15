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

const getChanges = (configBefore, configAfter) => {
  const keys = _.union(Object.keys(configBefore), Object.keys(configAfter));
  return keys.map((key) => {
    if (!_.has(configBefore, key)) {
      return { type: 'added', key, valueAfter: configAfter[key] };
    }
    if (!_.has(configAfter, key)) {
      return { type: 'deleted', key, valueBefore: configBefore[key] };
    }
    const valueBefore = configBefore[key];
    const valueAfter = configAfter[key];
    if (_.isPlainObject(valueBefore) && _.isPlainObject(valueAfter)) {
      const children = getChanges(valueBefore, valueAfter);
      return { type: 'node', key, children };
    }
    if (valueBefore !== valueAfter) {
      return {
        type: 'changed', key, valueBefore, valueAfter,
      };
    }
    return { type: 'unchanged', key, valueBefore };
  });
};


export default (filepath1, filepath2, outputFormat) => {
  const data1 = getFileData(filepath1);
  const extension1 = getFileExtension(filepath1);
  const configBefore = parse(data1, extension1);

  const data2 = getFileData(filepath2);
  const extension2 = getFileExtension(filepath2);
  const configAfter = parse(data2, extension2);

  const changes = getChanges(configBefore, configAfter);
  return format(changes, outputFormat);
};
