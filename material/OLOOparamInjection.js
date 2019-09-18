const Stack = {
  push(item, hidden) {
    hidden.items.push(item);
    return this;
  },

  pop(hidden) {
    return hidden.items.pop();
  },

  print(hidden) {
    console.log(hidden.items);
  },

  init() {
    const hidden = Object.create({ items: [] });

    const handler = {
      get(instance, key, proxy) {
        const value = instance[key];

        if (typeof value === 'function') {
          return (...args) => value.apply(proxy, [...args, hidden]);
        }

        return Reflect.get(instance, key, hidden);
      },
    }

    return new Proxy(this, handler);
  },
};

var stack = Object.create(Stack).init();
stack.push('a').push('b');

stack.print(); // ['a', 'b']
stack.pop();
stack.pop();
stack.pop();
stack.pop();
stack.print(); // []

var propNames = 'getOwnPropertyNames';
var p = console.log;

p(Object[propNames](stack));   // []
p(Object[propNames](Stack));   // ['push','pop','print', 'init']

// // expose data
// Stack.api.expose = function(inner) {
//   return inner;
// }
//
// stack.push('a').push('b');
// var exposed = stack.expose();
//
// p(Object.getPrototypeOf(exposed) === Stack._private);
//
// p(Object[propNames](exposed)); // items <- no other own properties
// p(Object[propNames](Stack._private)); // ['init']

module.exports = Stack;
