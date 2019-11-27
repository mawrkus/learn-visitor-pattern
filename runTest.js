const assert = require('assert');
const transpile = require('./transpile');

module.exports = {
  runTest({ name, input, options, expected }) {
    console.log('Running test "%s"...', name);
    const output = transpile(input, options);
    assert.deepEqual(output, expected);
    console.log(':D All good!');
  },
  xrunTest({ name }) {
    console.log('Skipping test "%s".', name);
  },
};
