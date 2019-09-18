var Stack = (function() {
  const stackAPI = {
    push(item, _) {
      _.items.push(item);
      return this;
    },

    pop(_) {
      return _.items.pop();
    },
  };

  const stackData = {
    init() {
      this.items = [];
      return this;
    }
  };

  const handlerFactory = function(_) {
    return {
      get(instance, key, proxy) {
        const value = instance[key];

        if (typeof value === 'function') {
          return (...args) => value.apply(proxy, [...args, _]);
        }

        return instance[key];
      },
    };
  };

  const factory = function() {
    const instance = Object.create(stackAPI);
    const _ = Object.create(stackData).init();
    const proxy = new Proxy(instance, handlerFactory(_));

    return proxy;
  };

  factory.prototype = stackAPI;

  return factory;
})();

module.exports = Stack;
