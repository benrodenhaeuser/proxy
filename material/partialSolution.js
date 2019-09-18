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
      return proto[key].apply(instance, [...args, data]); // can't use instance[key]
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
console.log(stack1.pop() === 'b'); // true

// Stack data is private
console.log(stack1.__proto__.data === undefined); // true
console.log(stack1.data === undefined);           // true

// Stack instances have a meaningful prototype
console.log(stack1.__proto__ === stack2.__proto__); // true
console.log(stack1.__proto__ === Stack.prototype);  // true

// Behaviour is defined on the instance
console.log(stack1.print === stack1.__proto__.print); // false
console.log(stack1.print === stack2.print);           // false
