// My second solution: manipulating `this` with bind (sub-optimal)

var Stack = {
  push: function (value) {
    this.push(value);
    return this;
  },

  pop: function () {
    return this.pop();
  },

  print: function() {
    this.forEach(function(value) {
      console.log(value);
    });
  },

  init: function () {
    var data  = [];
    var proto = Object.getPrototypeOf(this);

    Object.keys(proto).forEach(function(key) {
      if (key !== 'init' && typeof proto[key] === 'function') {
        this[key] = proto[key].bind(data);
      }
    }.bind(this));

    return this;
  },
};

var stack1 = Object.create(Stack).init();
var stack2 = Object.create(Stack).init();

stack1.push('a').push('b');
stack1.print();                    // 'a' and 'b' are logged
console.log('');
stack2.print();                    // nothing is logged
console.log(stack1.pop() === 'b'); // true

// a) Stack data is private (GOOD)
console.log(stack1.__proto__.data === undefined); // true
console.log(stack1.data === undefined);           // true

// b) Stack instances have a meaningful prototype (GOOD)
console.log(stack1.__proto__ === stack2.__proto__); // true
console.log(stack1.__proto__ === Stack);            // true

// c) Behaviour is defined on the instance (BAD)
console.log(stack1.print === stack1.__proto__.print); // false
console.log(stack1.print === stack2.print);           // false

// c) Changes on the prototype do NOT propagate to all instances (BAD)
stack1.__proto__.print = function () { console.log('Changed print method'); }
stack2.print(); // Nothing is logged here

// Main weakness: changes on the prototype at runtime do NOT propagate.
