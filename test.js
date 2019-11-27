const { runTest, xrunTest } = require('./runTest');

runTest({
  name: '#1',
  input: {
    name: 'Ignacio',
    surname: 'Valencia',
    credentials: {
      username: 'nacho',
      password: 'xxx',
    },
  },
  options: {
    credentials(node) {
      const { username, password } = node;
      return `${username}:${password}`;
    },
  },
  expected: {
    name: 'Ignacio',
    surname: 'Valencia',
    credentials: 'nacho:xxx',
  },
});

xrunTest({
  name: '#2',
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
    credentials(node) {
      const { username, password } = node;
      return `${username}:${password}`;
    },
  },
  expected: {
    createdOn: 'today',
    identity: {
      name: 'Ignacio',
      surname: 'Valencia',
      credentials: 'nacho:xxx',
    },
  },
});

xrunTest({
  name: '#3',
  input: {
    name: 'Ignacio',
    surname: 'Valencia',
    credentials: {
      username: 'nacho',
      password: 'xxx',
    },
    friend: {
      name: 'Marc',
      surname: 'M.',
      credentials: {
        username: 'mawrkus',
        password: 'zzz',
      },
    },
  },
  options: {
    credentials(node) {
      const { username, password } = node;
      return `${username}:${password}`;
    },
  },
  expected: {
    name: 'Ignacio',
    surname: 'Valencia',
    credentials: 'nacho:xxx',
    friend: {
      name: 'Marc',
      surname: 'M.',
      credentials: {
        username: 'mawrkus',
        password: 'zzz',
      },
    },
  },
});
