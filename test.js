const { runTest, xrunTest } = require('./runTest');
const { rootSymbol } = require('./traverse');

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
  visitor: {
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
  visitor: {
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
  name: 'Change values at depth=1 & depth=2',
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
  visitor: {
    identity(node) {
      node.name = 'user';
      return node;
    },
    credentials(node) {
      node.name = 'secrets';
      node.value = {
        username: '*',
        password: '*',
      };
      return node;
    },
  },
  expected: {
    createdOn: 'today',
    user: {
      name: 'Ignacio',
      surname: 'Valencia',
      secrets: {
        username: '*',
        password: '*',
      },
    },
  },
});

runTest({
  name: 'Recursive changes of a primitive value',
  input: {
    network: {
      name: 'Nacho',
      username: 'NACHOVALEN',
      friend: {
        name: 'Marc',
        username: 'MAWRKUS',
        friend: {
          name: 'Alex',
          username: 'SVIRI',
        },
      },
    },
  },
  visitor: {
    username(node) {
      node.value = node.value.toLowerCase();
      return node;
    },
  },
  expected: {
    network: {
      name: 'Nacho',
      username: 'nachovalen',
      friend: {
        name: 'Marc',
        username: 'mawrkus',
        friend: {
          name: 'Alex',
          username: 'sviri',
        },
      },
    },
  },
});

runTest({
  name: 'Recursive changes of an object',
  input: {
    network: {
      name: 'Nacho',
      username: 'nachovalen',
      friend: {
        name: 'Marc',
        username: 'mawrkus',
        friend: {
          name: 'Alex',
          username: 'sviri',
        },
      },
    },
  },
  visitor: {
    friend(node) {
      node.value = {
        ...node.value,
        name: '?',
        username: '*',
      };
      return node;
    },
  },
  expected: {
    network: {
      name: 'Nacho',
      username: 'nachovalen',
      friend: {
        name: '?',
        username: '*',
        friend: {
          name: '?',
          username: '*',
        },
      },
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
  visitor: {
    credentials(node) {
      if (node.parent.name === rootSymbol) {
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
  visitor: {
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
  visitor: {
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
  visitor: {
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

runTest({
  name: 'Add root level values',
  input: {
    name: 'Ignacio',
    surname: 'Valencia',
    credentials: {
      username: 'nacho',
      password: 'toomanysecrets',
    }
  },
  visitor: {
    [rootSymbol](node) {
      node.value = {
        ...node.value,
        // add only, for instance setting
        // name: 'I.' will not work as only the original input is traversed
        status: 'In a relationship',
      };
      return node;
    },
    surname: 'V.',
  },
  expected: {
    name: 'Ignacio',
    surname: 'V.',
    credentials: {
      username: 'nacho',
      password: 'toomanysecrets',
    },
    status: 'In a relationship',
  },
});

runTest({
  name: 'Setting values to "undefined"',
  input: {
    name: 'Ignacio',
    surname: 'Valencia',
    credentials: {
      username: 'nacho',
      password: 'toomanysecrets',
    }
  },
  visitor: {
    credentials: undefined,
  },
  expected: {
    name: 'Ignacio',
    surname: 'Valencia',
    credentials: undefined,
  },
});

console.log('\nAll tests finished.\n');
