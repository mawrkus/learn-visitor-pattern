const isObject =  (thing) => Object.prototype.toString.call(thing) === '[object Object]';

const createNode = (parent) => ([name, value]) => {
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

function traverse(sourceObject, visitor, currentParentNode = null) {
  let result = {};

  const sourceObjectEntries = [
    [rootSymbol, sourceObject],
    ...Object.entries(sourceObject),
  ];

  sourceObjectEntries.forEach(([sourceKey, sourceValue]) => {
    let node = createNode(currentParentNode)([sourceKey, sourceValue]);

    const visitorMethodOrValue = visitor[sourceKey];

    if (typeof visitorMethodOrValue !== 'undefined') {
      if (typeof visitorMethodOrValue === 'function') {
        node = visitorMethodOrValue(node)
      } else {
        node.value = visitorMethodOrValue;
      }

      if (sourceKey === rootSymbol) {
        result = node.value;
        return;
      }
    } else if ((sourceValue !== sourceObject) && isObject(sourceValue)) {
      node.value = traverse(sourceValue, visitor, node);
    }

    result[node.name] = node.value;
  });

  return result;
}

module.exports = {
  traverse,
  rootSymbol,
};
