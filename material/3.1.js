// Naveed's comment


function partiallyApply(argument, receiver, methodKey, context) {
  return function(...args) {
    return receiver[methodKey].apply(context, [argument].concat(args));
  }
}

var Stack = {
  proto: {
    push: function (data, value) {
      data.push(value);
      return this;
    },

    pop: function (data) {
      return data.pop();
    },

    print: function (data) {
      function log(value) {
        console.log(value);
      }

      data.forEach(log);
    },
  },

  create: function create() {
    var stack = Object.create(this.proto);
    var data  = [];

    Object.keys(this.proto).forEach(function(methodKey) {
      stack[methodKey] = partiallyApply(data, this.proto, methodKey, stack);
    }.bind(this));

    return stack;
  }
}

var stack1 = Stack.create();
var stack2 = Stack.create();

stack1.push('a').push('b');
stack1.print();                    // 'a' and 'b' are logged
stack2.print();                    // nothing is logged
console.log(stack1.pop() === 'b'); // true

// a) Stack data is private (GOOD)
console.log(stack1.__proto__.data === undefined); // true
console.log(stack1.data === undefined);           // true

// b) Stack instances have a meaningful prototype (GOOD)
console.log(stack1.__proto__ === stack2.__proto__); // true
console.log(stack1.__proto__ === Stack.proto);      // true

// c) Behaviour is defined on the instance (BAD)
console.log(stack1.print === stack1.__proto__.print); // false
console.log(stack1.print === stack2.print);           // false

// c) However, changes on the prototype still propagate to all instances (GOOD)
stack1.__proto__.print = function () { console.log('Changed print method'); }
stack2.print(); // 'Changed print method'
