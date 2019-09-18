// generic pattern for setting up a "type"

var makeType = function(prototype, initialData) {
  return {
    // prototype passed in by client
    prototype: prototype,
    // method to initialize the private data object
    get initialData() { return initialData() },

    handler(data) {
      return {
        get(instance, key, proxy) {
          const value = instance[key];

          // instance methods obtain access to private data
          if (typeof value === 'function') {
            return (...args) => value.apply(proxy, [...args, data]);
          }

          // for properties that are not functions, use default
          return value;
        },
      };
    },

    factory() {
      const instance = Object.create(this.prototype);
      const handler  = this.handler(this.initialData);

      return new Proxy(instance, handler);
    },
  }
};

// Let's make a stack

// Intended prototype
var prototype = {
  push: function (value, data) {
    data.push(value);
    return this;
  },

  pop: function (data) {
    return data.pop();
  },
}

// Want to initialize with empty array
var initialData = function() {
  return [];
}

// make the Stack type
var Stack = makeType(prototype, initialData);

// create an instance (wrapped in proxy)
var stack = Stack.factory();

// it works:
stack.push('a').push('b');
console.log(stack.pop());
console.log(stack.pop());
