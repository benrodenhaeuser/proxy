// ------------------------------------------------------
// 1. Factory Pattern
// ------------------------------------------------------

var createStack = function createStack() {
  var stack = [];

  return {
    push: function(value) {
      stack.push(value);
      return this;
    },

    pop: function() {
      return stack.pop();
    },

    print: function() {
      stack.forEach(function(value) {
        console.log(value);
      });
    }
  };
};

var stack1 = createStack();
var stack2 = createStack();
stack1.push('a').push('b');
stack1.print();                    // 'a' and 'b' are logged
stack2.print();                    // nothing is logged
console.log(stack1.pop() === 'b'); // true

// a) Stack data is private (GOOD)
console.log(stack1.__proto__.data); // undefined - no data attribute on proto
console.log(stack1.data);           // undefined - no data attribute on instance

// b) Stack instances do not have a meaningful type (BAD)
console.log(stack1.__proto__ === stack2.__proto__); // true
console.log(stack1.__proto__ === Object.prototype); // true

// c) Behaviour is defined on the instance (BAD)
console.log(stack1.print === stack1.__proto__.print); // false
console.log(stack1.print === stack2.print);           // false
