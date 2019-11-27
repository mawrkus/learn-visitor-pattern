const isObject =  (thing) => Object.prototype.toString.call(thing) === '[object Object]';

const createNode = (parent) => ([name, value]) => ({
  name,
  value,
  parent,
  children: [],
});

module.exports = function traverse(sourceObject, visitor, currentParentNode = null) {
  const result = {};
  const sourceObjectEntries = Object.entries(sourceObject);

  sourceObjectEntries.forEach(([sourceKey, sourceValue]) => {
    let node = createNode(currentParentNode)([sourceKey, sourceValue]);

    const isSourceValueObject = isObject(sourceValue);

    // direct children only ;)
    // the proper approach would be to parse the source object to generate an AST, then to visit
    node.children = isSourceValueObject
      ? Object.entries(sourceValue).map(createNode(node))
      : [];

    const visitorMethodOrValue = visitor[sourceKey];

    if (typeof visitorMethodOrValue !== 'undefined') {
      if (typeof visitorMethodOrValue === 'function') {
        node = visitorMethodOrValue(node)
      } else {
        node.value = visitorMethodOrValue;
      }
    } else if (isSourceValueObject) {
      node.value = traverse(sourceValue, visitor, node);
    }

    result[node.name] = node.value;
  });

  return result;
}
