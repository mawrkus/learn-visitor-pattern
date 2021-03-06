const assert = require('assert');
const { traverse } = require('./traverse');

module.exports = {
  runTest({ name, input, visitor, expected }) {
    console.log('\nRunning test "%s"...', name);

    const output = traverse(input, visitor);

    try {
      assert.deepEqual(output, expected);
      console.log('\033[1;32mok!\033[0m');
    } catch (error) {
      console.error('\033[1;31mfail!\033[0m\n');
      throw error;
    }
  },
  xrunTest({ name }) {
    console.log('\nSkipping test "%s".', name);
  },
};
