const Stack = {
  prototype: {
    push(private, value) {
      private.values.push(value);
      return this;
    },

    pop(private) {
      return private.values.pop();
    },

    print(private) {
      console.log(private.values);
    }
  },

  handler(private) {
    return {
      get(instance, key, proxy) {
        const value = instance[key];

        if (typeof value === 'function') {
          return (...args) => value.apply(proxy, [private, ...args]);
        }

        return value;
      },
    };
  },

  factory(private = { values: [] }) {
    const instance = Object.create(this.prototype);
    const handler  = this.handler(private);

    return new Proxy(instance, handler);
  },
};

module.exports = Stack;

// Advantage of our setup:
// - predictable: `this` is always the proxy.
// - allows method chaining.

// THE GROUND RULE:
// The data parameter is injected by the proxy.
// There is a source of confusion, and the following ground rule has to be respected at all times:
// So *when calling a method*, always omit the data parameter,
// because all methods are handled by the proxy, and will have the data parameter injected.
// On the other hand, *when defining a method*, always use data parameter, because all methods will be called with that parameter (after having it injected by the proxy).

// var initialData = { values: [] };
var stack = Stack.factory();
stack.push(1).push(2);

// FINE:
stack.push2 = function(data, value) { // signature always includes data param
  this.push(value); // method invocations never include data param
}

// Never do this:
stack.push3 = function(data, value) {
  this.push(data, value);
}

stack.push2('a');
var value = stack.pop();
console.log(value); // a
stack.push3('b');
stack.print(); // [ 1, 2, [Circular] ] // it looks like the array has itself as an element
console.log(stack.pop()); // [1, 2] (!)
// ^ we have pushed [1, 2] on the stack [1, 2], so
// it looked like [1, 2, [1, 2]], and now we have
// retrieved [1, 2] back again.

stack.print(); // [1, 2]

stack.push.call(stack, 'b'); //
// stack.push is a property lookup, so we get back a function which allows us to work with our data array.

stack.print(); // [1, 2. 'b'] (as desired, data was pushed)

var value = stack.pop.apply(stack);
console.log(value) // b

var stack2 = Stack.factory();
var stack3 = Stack.factory();
stack2.push('a').push('b');
stack3.push(1).push(2);
stack2.print(); // ['a', 'b']
stack3.print(); // [1, 2]

// what happens when someone uses apply?
// this will circumvent the proxy, <== no it won't!
// so we should
// probably define an apply handler?

// there is no risk of data exposure though, because
// the data is provided by the proxy.

// EXPLORE:

// add a private function `size`?
// - be able to extend the stack with a private method `size` that
//   returns the size
// - be able to define public method `prettyPrint` that prints 'no data
//   on this stack' if the stack is empty, and the stack otherwise

// - this seems to require some kind of "extend" method. do we have to provide
//   it upfront?

// if you think about it, we can simply put all the "implementation details" in
// the data object, and the functions focus on the API.

// if we have a function like size below, it looks like we do want to
// call it *with* data. because this function will not be proxied, it's
// not a property. Actually, no: this is a method on the data object, so we
// simply invoke it using dot notation on data.

var private = {
  values: [],
  size: function() {
    return this.values.length;
  },
};

var stack4 = Stack.factory(private);

stack4.push(10).push(20).print(); // [10, 20]

stack4.pretty = function(private) {
  if (private.size() === 0) {
    console.log('The stack is empty');
  } else {
    console.log(private.values);
  }
}

stack4.pretty(); // [10, 20]
stack4.pop();
stack4.pop();
stack4.pop();
stack4.pretty(); // The stack is empty


// Does it make a difference if we place the data param last?
// Can we find a way not to have to include the data param in the signature?
// => I think that is what I was trying to do when I ran into trouble.
