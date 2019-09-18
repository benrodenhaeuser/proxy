// ------------------------------------------------------------------
// Victor's solution
// ------------------------------------------------------------------

var Stack = (function() {
  var stack = {}
  var stackId;

  function incrementId() {
    if (stackId === undefined) {
      stackId = 0;
    } else {
      stackId += 1;
    }
  }

  return {
    push: function(value) {
      stack[this.id].push(value);
      return this;
    },

    pop: function() {
      return stack[this.id].pop();
    },

    print: function() {
      stack[this.id].forEach(function(value) {
        console.log(value);
      });
    },

    init: function() {
      incrementId()
      this.id = stackId;
      stack[this.id] = [];
      return this;
    },
  };
})();

var stack1 = Object.create(Stack).init();
var stack2 = Object.create(Stack).init();

// private stack
console.log(stack1.stack === undefined);
console.log(stack2.stack === undefined);

stack1.push('a');
stack2.push(1);
stack2.push(2);

stack1.print();   // logs 'a'
stack2.print();   // logs 1

stack1.stack = undefined;
stack2.stack = 'test';
stack1.print();   // still logs 'a'
stack2.print();   // still logs 1

// meaningful prototye
console.log(stack1.__proto__ === Stack); // true
console.log(stack2.__proto__ === stack1.__proto__);  // true
console.log(stack1.__proto__ === Object.prototype)  // false
console.log(stack2.__proto__ === Object.prototype)  // false

// behavior is defined on the prototype
console.log(stack1.hasOwnProperty('print'));  // logs false
console.log(stack2.hasOwnProperty('print'));  // logs false
console.log(stack1.__proto__.hasOwnProperty('print')); // true


Stack.print = function() { console.log('Changed print method'); }
stack1.print(); // Changed print method

stack3 = Object.create(Stack).init();

console.log(stack1.id); // NaN
console.log(stack2.id); // 0
console.log(stack3.id);
