const { runTest, xrunTest } = require('./runTest');

runTest({
  name: 'Change values at depth=1',
  input: {
    name: 'Ignacio',
    surname: 'Valencia',
    credentials: {
      username: 'nacho',
      password: 'xxx',
    },
  },
  options: {
    surname(node) {
      node.value = 'V.';
      return node;
    },
    credentials(node) {
      const { username, password } = node.value;
      node.value = `${username}:${password}`;
      return node;
    },
  },
  expected: {
    name: 'Ignacio',
    surname: 'V.',
    credentials: 'nacho:xxx',
  },
});

runTest({
  name: 'Change values at depth=2',
  input: {
    createdOn: 'today',
    identity: {
      name: 'Ignacio',
      surname: 'Valencia',
      credentials: {
        username: 'nacho',
        password: 'xxx',
      },
    },
  },
  options: {
    surname(node) {
      node.value = 'V.';
      return node;
    },
    credentials(node) {
      const { username, password } = node.value;
      node.value = `${username}:${password}`;
      return node;
    },
  },
  expected: {
    createdOn: 'today',
    identity: {
      name: 'Ignacio',
      surname: 'V.',
      credentials: 'nacho:xxx',
    },
  },
});

runTest({
  name: 'Change value based on parent',
  input: {
    name: 'Ignacio',
    surname: 'Valencia',
    credentials: {
      username: 'nacho',
      password: 'xxx',
    },
    friend: {
      name: 'Marc',
      surname: 'Mignonsin',
      credentials: {
        username: 'mawrkus',
        password: 'zzz',
      },
    },
  },
  options: {
    credentials(node) {
      if (!node.parent) {
        const { username, password } = node.value;
        node.value = `${username}:${password}`;
      }
      return node;
    },
  },
  expected: {
    name: 'Ignacio',
    surname: 'Valencia',
    credentials: 'nacho:xxx',
    friend: {
      name: 'Marc',
      surname: 'Mignonsin',
      credentials: {
        username: 'mawrkus',
        password: 'zzz',
      },
    },
  },
});

runTest({
  name: 'Rename',
  input: {
    name: 'Ignacio',
    surname: 'Valencia',
    friend: {
      name: 'Marc',
      surname: 'Mignonsin',
    },
  },
  options: {
    surname(node) {
      node.name = 'familyName';
      return node;
    },
  },
  expected: {
    name: 'Ignacio',
    familyName: 'Valencia',
    friend: {
      name: 'Marc',
      familyName: 'Mignonsin',
    },
  },
});

runTest({
  name: 'Rename and change values',
  input: {
    name: 'Ignacio',
    surname: 'Valencia',
    friend: {
      name: 'Marc',
      surname: 'Mignonsin',
    },
  },
  options: {
    surname(node) {
      node.name = 'familyName';
      node.value = `${node.value[0]}.`;
      return node;
    },
  },
  expected: {
    name: 'Ignacio',
    familyName: 'V.',
    friend: {
      name: 'Marc',
      familyName: 'M.',
    },
  },
});

console.log('\n:All tests finished.\n');
