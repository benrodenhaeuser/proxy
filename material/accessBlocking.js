const Stack = {
  push(item) {
    this._private.push(item);
    return this.proxy;
  },

  pop() {
    return this._private.pop();
  },

  print() {
    console.log(this._private)
  },

  init() {
    const handler = {
      get(instance, key, proxy) {
        var value = instance[key];

        if (key === '_private') {
          throw 'Invalid attempt to access private property';
        }

        if (typeof value === 'function') {
          return function(...args) {
            return value.apply(instance, args);
          };
        }

        return value;
      },

      set(instance, key, value, proxy) {
        if (key === '_private') {
          throw 'Invalid attempt to set private property';
        }

        instance[key] = value;
      },
    }

    const proxy   = new Proxy(this, handler);
    this.proxy    = proxy;
    this._private = [];

    return proxy;
  }
};

var stack = Object.create(Stack).init();
stack.push('a');
stack.push('b');
stack.print(); // [ 'a', 'b' ]

// console.log(stack._private); // throws

var stack2 = Object.create(Stack).init();
stack2.push(1);
stack2.push(2);

stack.print();  // ['a', 'b']
stack2.print(); // [1, 2]

// having init return a *different* object seems weird.
// the solution is to make a dedicated "create" method. 


// stack2.print2 = function() {
//   this.print();
// };
//
// stack2.print2(); // [ 'a', 'b' ]
// // ^ fine
//
// var stack3 = Stack.create();
//
// // if push simply returns `this`, the following happens:
// // var internalStack = stack.push(1);
// // stack.print(); // [1]
// //
// // console.log(internalStack._private);
// // { init: [Function: init], items: [ 1 ] }
//
// // ^ at this point, we have broken into the proxy!
//
// // if `push` returns `this.proxy`, this problem does not arise.
//
// // we also need a set handler, for otherwise we could do:
// // stack2._private = { items: [] };
// // stack2.print();
//
// // A problem with this approach (as it is formulated right now):
// // A user could use the Stack API by creating a naked instance:
//
// var stack4 = Object.create(Stack.proto);
// // works without init??
// // ^ this is because of the preceding code.
// //   if preceding code is commented out, this does not work.
// //   it looks like there is an items property ALREADY on the prototype?
// console.log(stack4._private);
// console.log(stack4._private.items);
// console.log(stack4.proxy);
// stack4.push('a');
// console.log(stack4._private.items);
// stack4.push('b');
//
// console.log(stack4._private.items);
