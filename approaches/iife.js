// --------------------------------------
// IIFE
// --------------------------------------

var Stack = (function() {
  var data = {};

  var nextId = (function() {
    var id = 0;
    return function() { return id++; };
  })();

  return {
    push: function(value) {
      data[this.id].push(value);
      return this;
    },

    pop: function() {
      return data[this.id].pop();
    },

    print: function() {
      data[this.id].forEach(function(value) {
        console.log(value);
      });
    },

    init: function() {
      this.id = nextId();
      data[this.id] = [];
      return this;
    },
  };
})();

var stack1 = Object.create(Stack).init();
var stack2 = Object.create(Stack).init();
var stack3 = Object.create(Stack).init();

stack1.push('a');
stack2.push(1);
stack3.push('HOWDY');

stack1.print(); // 'a'
console.log('');
stack2.print(); // 1
console.log('');
stack3.print(); // 1
console.log('');

// meaningful prototye
console.log(stack1.__proto__ === Stack); // true
console.log(stack2.__proto__ === stack1.__proto__);  // true

// behavior is defined on the prototype
console.log(stack1.hasOwnProperty('print'));  // logs false
console.log(stack2.hasOwnProperty('print'));  // logs false
console.log(stack1.__proto__.hasOwnProperty('print')); // true

// Let's see if we can define a new function:

stack1.__proto__.second = function() {
  console.log(stack[this.id][1]);
}
stack2.second(); // "stack is not defined"

// ... this aspect still does not work, because we have lost the closure,
// i.e., we don't have access to the `stack` object

// Stack data is not kept neatly separate: in fact, all data is in a single object, so as long as we have one stack around, all stack data will remain in memory. And since the data object is not accessible outside of the closure it stores, there is nothing we can really do about it.

// would that qualify as a memory leak?
