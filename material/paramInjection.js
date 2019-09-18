const Stack = {
  api: {
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
  },

  _private: {
    init() {
      this.items = [];
      return this;
    },
  },

  create() {
    const instance = Object.create(this.api);
    const hidden   = Object.create(this._private).init();

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
  },
};

var stack = Stack.create('My stack', []);
stack.push('a').push('b');

stack.print(); // ['a', 'b']
stack.pop();
stack.pop();
stack.pop();
stack.pop();
stack.print(); // []

var propNames = 'getOwnPropertyNames';
var p = console.log;

p(Object[propNames](stack));       // []
p(Object[propNames](Stack.api));   // ['push','pop','print', 'size']

// expose data
Stack.api.expose = function(inner) {
  return inner;
}

stack.push('a').push('b');
var exposed = stack.expose();

p(Object.getPrototypeOf(exposed) === Stack._private);

p(Object[propNames](exposed)); // items <- no other own properties
p(Object[propNames](Stack._private)); // ['init']

// can also use it like this:
var pseudoStack = Object.create(Stack.api);
var items = []
pseudoStack.data = { items: items };
pseudoStack.push('a', pseudoStack.data);
pseudoStack.push('b', pseudoStack.data);
pseudoStack.print(pseudoStack.data);
// ^ does not work because of call to size
//   but otherwise it's fine

// so the "pseudo stack" approach works as long
// as there are no cross calls of api methods

module.exports = Stack;
