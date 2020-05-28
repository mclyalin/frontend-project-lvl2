#!/usr/bin/env node

import program from 'commander';
import f from '../index.js';

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format', 'default')
  .action((filepath1, filepath2, options) => {
    console.log(f(filepath1, filepath2, options));
  })
  .parse(process.argv);
