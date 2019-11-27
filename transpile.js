const isObject =  (thing) => Object.prototype.toString.call(thing) === '[object Object]';

module.exports = function transpile(sourceObj, visitorOptions, currentParentNode = null) {
  const result = {};

  Object.entries(sourceObj).forEach(([sourceKey, sourceValue]) => {
    let node = {
      name: sourceKey,
      value: sourceValue,
      parent: currentParentNode,
    };

    if (typeof visitorOptions[sourceKey] === 'function') {
      node = visitorOptions[sourceKey](node);
    } else if (isObject(sourceValue)) {
      node.value = transpile(sourceValue, visitorOptions, node);
    }

    result[node.name] = node.value;
  });

  return result;
}
