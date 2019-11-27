const isObject =  (thing) => Object.prototype.toString.call(thing) === '[object Object]';

const createNode = (parent) => ([name, value]) => ({
  name,
  value,
  parent,
  children: [],
});

module.exports = function transpile(sourceObject, visitors, currentParentNode = null) {
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

    const visitor = visitors[sourceKey];

    if (typeof visitor !== 'undefined') {
      if (typeof visitor === 'function') {
        node = visitor(node)
      } else {
        node.value = visitor;
      }
    } else if (isSourceValueObject) {
      node.value = transpile(sourceValue, visitors, node);
    }

    result[node.name] = node.value;
  });

  return result;
}
