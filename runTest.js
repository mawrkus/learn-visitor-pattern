const assert = require('assert');
const transpile = require('./transpile');

module.exports = {
  runTest({ name, input, visitors, expected }) {
    console.log('\nRunning test "%s"...', name);

    const output = transpile(input, visitors);

    try {
      assert.deepEqual(output, expected);
      console.log('-> ok!');
    } catch (error) {
      console.error('-> fail!');
      console.error('\nExpected: %o', expected);
      console.error('\nReceived: %o\n', output);
      console.log(error);
    }
  },
  xrunTest({ name }) {
    console.log('\nSkipping test "%s".', name);
  },
};
