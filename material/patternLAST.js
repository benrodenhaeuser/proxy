// data and methods

const Stack = {
  api: {
    push(obj) {
      obj.inner.list.push(obj.value);
      return this;
    },

    pop(obj) {
      return obj.inner.list.pop();
    },

    print(obj) {
      if (this.size() === 0) {
        console.log('The stack is empty');
      } else {
        console.log(obj.inner.list);
      }
    },

    size(obj) {
      return obj.inner.list.length;
    },
  },

  inner: {
    init() {
      this.list = [];
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
          return (obj = {}) => value.call(proxy, Object.assign(obj, { inner: inner }));
        }

        return value;
      },
    }

    return new Proxy(instance, handler);
  },
};

module.exports = Stack;

var stack = Stack.create('My stack', []);
stack.push({ value: 'a' }).push({ value: 'b' });

stack.print(); // ['a', 'b']
stack.pop();
stack.pop();
stack.pop();
stack.pop();
stack.print(); // The stack is empty
//
// var propNames = 'getOwnPropertyNames';
// var p = console.log;
//
// p(Object[propNames](stack));       // []
// p(Object[propNames](Stack.api));   // ['push','pop','print', 'size']
// p(Object[propNames](Stack.inner)); // ['init']
//
// // expose data
// Stack.api.expose = function(inner) {
//   return inner;
// }
//
// stack.push('a').push('b');
// console.log(stack.expose()); // { list: [ 'a', 'b' ] }
//
// stack.pop();
// stack.pop();
//
// stack.push();
// console.log(stack.pop());
