var Stack = {
  push: function (value, data) {
    data.push(value);
  },

  pop: function (data) {
    return data.pop();
  },

  print: function(data) {
    console.log(data.toString());
  },

  init: function() {
    var data = [];

    var handler = {
      get: (self, prop) => {
        var proto      = Object.getPrototypeOf(self);
        var hasOwnProp = Object.prototype.hasOwnProperty.call(self, prop);
        var hasProp    = self[prop] !== undefined

        if (!hasOwnProp && hasProp) {
          return (...args) => proto[prop].apply(self, args.concat([data]));
        } else {
          return self[prop];
        }
      }
    };

    return new Proxy(this, handler);
  },
};

var stack1 = Object.create(Stack).init();
var stack2 = Object.create(Stack).init();
var stack1Proto = Object.getPrototypeOf(stack1);
var stack2Proto = Object.getPrototypeOf(stack2);

// Stack instances have their own separate data
stack1.push('a');
stack1.push('b');
stack2.push(1);
stack1.print();                    // logs 'a,b'
stack2.print();                    // logs '1'

// Stack instance data is private
console.log(stack1.data === undefined);      // logs true
console.log(stack1Proto.data === undefined); // logs true

// Stack instances have Stack as prototype
console.log(stack1Proto === stack2Proto); // logs true
console.log(stack1Proto === Stack);       // logs true

// Behaviour is defined on Stack prototype, not on instances
console.log(!stack1.hasOwnProperty('print')); // logs true
console.log(!stack2.hasOwnProperty('print')); // logs true
console.log(Stack.hasOwnProperty('print'));   // logs true

// Can set properties on Stack instances
stack1.name = 'Stack 1';
console.log(stack1.name); // logs 'Stack 1'

// Can change existing methods on Stack prototype
Stack.print = function () { console.log('Changed existing method'); }
stack2.print(); // logs 'Changed existing method'

// Can attach new methods to Stack prototype that use data parameter
Stack.size = function(data) { return data.length; }
console.log(stack1.size()); // logs 2 (stack1 has two elements)
console.log(stack2.size()); // logs 1 (stack2 has one element)

// property lists for instances and prototype
console.log(Object.getOwnPropertyNames(stack1)); // ['name']
console.log(Object.getOwnPropertyNames(stack2)); // []
console.log(Object.getOwnPropertyNames(Stack));
// ^ [ 'push', 'pop', 'print', 'init', 'size' ]
