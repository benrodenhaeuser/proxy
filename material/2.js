// ------------------------------
// 2. OLOO + Factory Pattern
// ------------------------------

var Stack = {
  proto: {
    push: function (value) {
      this.data.push(value);
      return this;
    },

    pop: function () {
      return this.data.pop();
    },

    print: function () {
      function log(value) {
        console.log(value);
      }

      this.data.forEach(log);
    }
  },

  create: function () {
    var data = [];

    return Object.create(this.proto, {
      data: {
        value: data,
      }
    });
  }
};

var stack1 = Stack.create();
var stack2 = Stack.create();

stack1.push('a').push('b');
stack1.print();                    // 'a' and 'b' are logged
stack2.print();                    // nothing is logged
console.log(stack1.pop() === 'b'); // true

// a) Stack data is exposed (BAD)
console.log(stack1.__proto__.data === undefined); // true
console.log(stack1.data === ['a'])                // true

// b) Stack instances have a meaningful prototype (GOOD)
console.log(stack1.__proto__ === stack2.__proto__); // true
console.log(stack1.__proto__ === Stack.proto);      // true

// c) Behaviour is defined on the prototype (GOOD)
console.log(stack1.print === stack1.__proto__.print); // true
console.log(stack1.print === stack2.print);           // true
