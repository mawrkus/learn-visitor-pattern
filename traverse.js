const isObject = thing => Object.prototype.toString.call(thing) === '[object Object]';

const createNode = parent => ([name, value]) => {
  const node = {
    name,
    value,
    parent,
    children: [],
  };

  node.children = isObject(value)
    ? Object.entries(value).map(createNode(node))
    : [];

  return node;
};

const rootSymbol = Symbol('root');

function traverse(sourceObject, visitor) {
  let result = {};
  let node = createNode(null)([rootSymbol, sourceObject]);

  if (rootSymbol in visitor) {
    const visitorMethodOrValue = visitor[rootSymbol];

    if (typeof visitorMethodOrValue === 'function') {
      node = visitorMethodOrValue(node);
    } else {
      node.value = visitorMethodOrValue;
    }

    result = node.value;
  }

  return {
    ...result,
    ..._traverse(sourceObject, visitor, node),
  };
}

function _traverse(sourceObject, visitor, parentNode) {
  const result = {};
  const sourceObjectEntries = Object.entries(sourceObject);

  sourceObjectEntries.forEach(([sourceKey, sourceValue]) => {
    let node = createNode(parentNode)([sourceKey, sourceValue]);

    if (sourceKey in visitor) {
      const visitorMethodOrValue = visitor[sourceKey];

      if (typeof visitorMethodOrValue === 'function') {
        node = visitorMethodOrValue(node);
      } else {
        node.value = visitorMethodOrValue;
      }
    } else if (isObject(sourceValue)) {
      node.value = _traverse(sourceValue, visitor, node);
    }

    result[node.name] = node.value;
  });

  return result;
}

module.exports = {
  traverse,
  rootSymbol,
};
