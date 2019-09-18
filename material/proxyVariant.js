var Stack = {
  proto: {
    push: function (value, data) {
      data.push(value);
    },

    pop: function (data) {
      return data.pop();
    },

    print: function(data) {
      console.log(data.toString());
    },
  },

  create: function() {
    var stack = Object.create(this.proto);
    var data = [];
    return new Proxy(stack, this.handler(data));
  },

  handler: function(data) {
    return {
      get: (target, prop) => {
        var proto      = Object.getPrototypeOf(target);
        var hasOwnProp = Object.prototype.hasOwnProperty.call(target, prop);
        var hasProp    = target[prop] !== undefined

        if (!hasOwnProp && hasProp) {
          return (...args) => proto[prop].apply(target, args.concat([data]));
        } else {
          return target[prop];
        }
      }
    }
  },
};

var stack1 = Stack.create();
var stack2 = Stack.create();
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
console.log(stack1Proto === Stack.proto); // logs true

// Behaviour is defined on Stack prototype, not on instances
console.log(!stack1.hasOwnProperty('print')); // logs true
console.log(!stack2.hasOwnProperty('print')); // logs true
console.log(Stack.proto.hasOwnProperty('print'));   // logs true

// Can set properties on Stack instances
stack1.name = 'Stack 1';
console.log(stack1.name); // logs 'Stack 1'

// Can change existing methods on Stack prototype
Stack.proto.print = function () { console.log('Changed existing method'); }
stack2.print(); // logs 'Changed existing method'

// Can attach new methods to Stack prototype that use data parameter
Stack.proto.size = function(data) { return data.length; }
console.log(stack1.size()); // logs 2 (stack1 has two elements)
console.log(stack2.size()); // logs 1 (stack2 has one element)

// property lists for instances and prototype
console.log(Object.getOwnPropertyNames(stack1)); // ['name']
console.log(Object.getOwnPropertyNames(stack2)); // []
console.log(Object.getOwnPropertyNames(Stack.proto));
// ^ [ 'push', 'pop', 'print', 'size' ]
