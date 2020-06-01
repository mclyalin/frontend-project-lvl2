import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import gendiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getPathTo = (name, extension) => (
  path.join(__dirname, '..', 'fixtures', `${name}.${extension}`)
);

const expected = fs.readFileSync(getPathTo('changes', 'txt'), 'utf8').trim();

describe('gendiff without options', () => {
  it('with json format', () => {
    const filepath1 = getPathTo('before', 'json');
    const filepath2 = getPathTo('after', 'json');
    expect(gendiff(filepath1, filepath2)).toBe(expected);
  });
  it('with yaml format', () => {
    const filepath1 = getPathTo('before', 'yml');
    const filepath2 = getPathTo('after', 'yml');
    expect(gendiff(filepath1, filepath2)).toBe(expected);
  })
});
