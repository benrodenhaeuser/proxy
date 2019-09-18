var Stack = (function() {
  const stackAPI = {
    push(item) {
      this._.items.push(item);
      return this;
    },

    pop() {
      return this._.items.pop();
    },
  };

  const stackData = {
    init() {
      this.items = [];
      return this;
    }
  };

  const handler = {
    get(instance, propKey, proxy) {
      if (propKey === '_') {
        throw new Error('Blocked attempt to read private property');
      }

      var propValue = instance[propKey];

      if (typeof propValue === 'function') {
        return function(...args) {
          var returnValue = propValue.apply(instance, args);
          if (returnValue === instance) {
            return proxy;
            // ^ protect instance from external access, allow method chaining
          }

          return returnValue;
        };
      }

      return propValue;
    },

    set(instance, propKey, propValue, proxy) {
      if (propKey === '_') {
        throw new Error('Blocked attempt to set private property');
      }

      instance[propKey] = propValue;
    },
  };

  const factory = function() {
    const instance = Object.create(stackAPI);
    instance._     = Object.create(stackData).init();

    return new Proxy(instance, handler);
  };

  factory.prototype = stackAPI;

  return factory;
})();

module.exports = Stack;
