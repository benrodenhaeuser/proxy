// --------------------------------------
// My solution
// --------------------------------------

// very hard to read

var Stack = {
  prototype: {
    push(value, data) {
      data.push(value);
      return this;
    },

    pop(data) {
      return data.pop();
    },
  },

  delegate(instance, key, data) {
    var proto = this.prototype;

    return function(...args) {
      return proto[key].apply(instance, [...args, data]);
    };
  },

  factory() {
    var proto    = this.prototype;
    var instance = Object.create(proto);
    var data     = [];

    Object.keys(proto).forEach(function(key) {
      if (typeof proto[key] === 'function') {
        instance[key] = this.delegate(instance, key, data);
      }
    }, this);

    return instance;
  },
};

var stack1 = Stack.factory();
var stack2 = Stack.factory();

stack1.push('a').push('b');
// stack1.print();                    // 'a' and 'b' are logged
// stack2.print();                    // nothing is logged
console.log(stack1.pop() === 'b'); // true

// a) Stack data is private (GOOD)
console.log(stack1.__proto__.data === undefined); // true
console.log(stack1.data === undefined);           // true

// b) Stack instances have a meaningful prototype (GOOD)
console.log(stack1.__proto__ === stack2.__proto__); // true
console.log(stack1.__proto__ === Stack.prototype);  // true

// c) Behaviour is defined on the instance (BAD)
console.log(stack1.print === stack1.__proto__.print); // false
console.log(stack1.print === stack2.print);           // false

// c) However, changes on the prototype still propagate to all instances (GOOD)
stack1.__proto__.print = function () { console.log('Changed print method'); }
// stack2.print(); // 'Changed print method'

// d) Adding a function is more tricky:
// stack1.__proto__.second = function(data) {
//   console.log(data[1]);
// }
// stack2.second(); // "Cannot read property of undefined"

// the reason is that `second` is defined on the prototype, so we can call it,
// but the intervening function on the instance is not defined.
// Is there a way around that?

// In Ruby, we might be able to use some sort of meta-programming.
// In JavaScript, it looks like Proxy objects might be the way to go.
