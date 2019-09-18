const Stack = (function() {
  const api = {
    push(item, hidden) {
      hidden.items.push(item);
      return this;
    },

    pop(hidden) {
      return hidden.items.pop();
    },

    print(hidden) {            // example
      console.log(hidden.items);
    },
  };

  const _private = {
    init() {
      this.items = [];
      return this;
    },
  };

  function create() {
    const instance = Object.create(api);
    const hidden   = Object.create(_private).init();

    const handler = {
      get(instance, key, proxy) {
        const value = instance[key];

        if (typeof value === 'function') {
          return (...args) => value.apply(proxy, [...args, hidden]);
        }

        return Reflect.get(instance, key, hidden);
      },
    }

    return new Proxy(instance, handler);
  };

  return { create: create } // no direct access to prototype
})();

// the only way to create a stack is to call Stack.create

var stack = Stack.create();
console.log(stack.name);
stack.push('a').push('b');

stack.print(); // ['a', 'b']
stack.pop();
stack.pop();
stack.pop();
stack.pop();
stack.print(); // []

var propNames = 'getOwnPropertyNames';
var p = console.log;

const proto = Object.getPrototypeOf(stack);

p(Object[propNames](stack));   // []
p(Object[propNames](Stack));   // [ 'create' ]
p(Object[propNames](proto));   // `push`, `pop`, `print`

// console.log(proto);

module.exports = Stack;
