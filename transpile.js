const isObject =  (thing) => Object.prototype.toString.call(thing) === '[object Object]';

module.exports = function transpile(sourceObject, visitors, currentParentNode = null) {
  const result = {};
  const sourceObjectEntries = Object.entries(sourceObject);

  sourceObjectEntries.forEach(([sourceKey, sourceValue]) => {
    let node = {
      name: sourceKey,
      value: sourceValue,
      parent: currentParentNode,
    };
    const visitor = visitors[sourceKey];

    if (typeof visitor !== 'undefined') {
      if (typeof visitor === 'function') {
        node = visitor(node)
      } else {
        node.value = visitor;
      }
    } else if (isObject(sourceValue)) {
      node.value = transpile(sourceValue, visitors, node);
    }

    result[node.name] = node.value;
  });

  return result;
}
