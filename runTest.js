const assert = require('assert');
const { traverse } = require('./traverse');

module.exports = {
  runTest({ name, input, visitor, expected }) {
    console.log('\nRunning test "%s"...', name);

    const output = traverse(input, visitor);

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
