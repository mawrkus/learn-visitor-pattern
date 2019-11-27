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
  visitors: {
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
  visitors: {
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
  name: 'Change values based on parent',
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
  visitors: {
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
  name: 'Rename and change values',
  input: {
    name: 'Ignacio',
    surname: 'Valencia',
    friend: {
      name: 'Marc',
      surname: 'Mignonsin',
    },
  },
  visitors: {
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

runTest({
  name: 'Set constant values',
  input: {
    name: 'Ignacio',
    surname: 'Valencia',
    friend: {
      name: 'Marc',
      surname: 'Mignonsin',
    },
  },
  visitors: {
    surname: '[redacted]',
  },
  expected: {
    name: 'Ignacio',
    surname: '[redacted]',
    friend: {
      name: 'Marc',
      surname: '[redacted]',
    },
  },
});

runTest({
  name: 'Change name based on direct children',
  input: {
    name: 'Ignacio',
    surname: 'Valencia',
    friend: {
      surname: 'Mignonsin',
      name: 'Marc',
    },
  },
  visitors: {
    friend(node) {
      const { children } = node;
      if (children.find(({ name, value }) => name === 'name' && value === 'Marc')) {
        node.name = 'colleague';
      }
      return node;
    },
  },
  expected: {
    name: 'Ignacio',
    surname: 'Valencia',
    colleague: {
      surname: 'Mignonsin',
      name: 'Marc',
    },
  },
});

console.log('\n:All tests finished.\n');
