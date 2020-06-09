import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { describe, test, expect } from '@jest/globals';
import gendiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getPathTo = (filename, extension) => (
  path.join(__dirname, '..', '__fixtures__', `${filename}.${extension}`)
);

const extensions = ['json', 'yml', 'ini'];
const outputFormats = ['stylish', 'plain'];

describe.each(outputFormats)('gendiff --format %s', (outputFormat) => {
  const expectedPath = getPathTo(`changes-${outputFormat}`, 'txt');
  const expected = fs.readFileSync(expectedPath, 'utf-8').trim();

  test.each(extensions)('with .%s files', (extension) => {
    const filepath1 = getPathTo('before', extension);
    const filepath2 = getPathTo('after', extension);
    expect(gendiff(filepath1, filepath2, outputFormat)).toBe(expected);
  });
});
