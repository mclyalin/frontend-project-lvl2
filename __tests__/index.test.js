import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import gendiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(dirname(__filename), '..', 'fixtures');

test('gendiff', () => {
  const filepath1 = path.join(__dirname, 'before.json');
  const filepath2 = path.join(__dirname, 'after.json');
  const changesPath = path.join(__dirname, 'changes-json.txt');
  const expected = fs.readFileSync(changesPath, 'utf8').trim();
  expect(gendiff(filepath1, filepath2)).toBe(expected);
});
