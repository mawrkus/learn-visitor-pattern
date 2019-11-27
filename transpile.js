const isObject =  (thing) => Object.prototype.toString.call(thing) === '[object Object]';

module.exports = function transpile(sourceObj, visitorOptions) {
  const result = {};

  Object.entries(sourceObj).forEach(([sourceKey, sourceValue]) => {
    let newValue = sourceValue;

    if (typeof visitorOptions[sourceKey] !== 'undefined') {
      newValue = visitorOptions[sourceKey](sourceValue);
    } else if (isObject(sourceValue)) {
      newValue = transpile(sourceValue, visitorOptions);
    }

    result[sourceKey] = newValue;
  });

  return result;
}
