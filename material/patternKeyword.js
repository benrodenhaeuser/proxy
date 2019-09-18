// data and methods

const Stack = {
  api: {
    push({ item, inner }) {
      inner.items.push(item);
      return this;
    },

    pop({ inner }) {
      return inner.items.pop();
    },

    print({ inner }) {
      if (this.size() === 0) {
        console.log('The stack is empty');
      } else {
        console.log(inner.items);
      }
    },

    size({ inner }) {
      return inner.items.length;
    },
  },

  inner: {
    init() {
      this.items = [];
      return this;
    }
  },

  create() {
    const instance = Object.create(this.api);
    const inner    = Object.create(this.inner).init();

    const handler = {
      get(instance, key, proxy) {
        const value = instance[key];

        if (typeof value === 'function') {
          return (args = {}) => value.call(
            proxy,
            Object.assign(args, { inner: inner } )
          );
        }

        return value;
      },
    }

    return new Proxy(instance, handler);
  },
};

module.exports = Stack;

var stack = Stack.create('My stack', []);
stack.push({ item: 'a' }).push({ item: 'b' });

stack.print(); // ['a', 'b']
stack.pop();
stack.pop();
stack.pop();
stack.pop();
stack.print(); // The stack is empty

var propNames = 'getOwnPropertyNames';
var p = console.log;

p(Object[propNames](stack));       // []
p(Object[propNames](Stack.api));   // ['push','pop','print', 'size']
p(Object[propNames](Stack.inner)); // ['init']

// expose data
Stack.api.expose = function(inner) {
  return inner;
}

stack.push({ item: 'a' }).push({ item: 'b' });
console.log(stack.expose()); // { items: [ 'a', 'b' ] }
