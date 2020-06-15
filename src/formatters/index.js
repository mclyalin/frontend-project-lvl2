import makeStylish from './stylish.js';
import makePlain from './plain.js';

const formatters = {
  stylish: makeStylish,
  plain: makePlain,
  json: JSON.stringify,
};

export default (tree, outputFormat) => formatters[outputFormat](tree);
