import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import gendiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test('gendiff', () => {
  const filepath1 = path.join(__dirname, '../fixtures/before.json');
  const filepath2 = path.join(__dirname, '../fixtures/after.json');
  const changesPath = path.join(__dirname,'../fixtures/changes.json.txt');
  const expected = fs.readFileSync(changesPath, 'utf8').trim();
  expect(gendiff(filepath1, filepath2)).toBe(expected);
});
