// ------------------------------------------------------------------
// 3. OLOO + Factory Pattern + Closure + Partial Function Application
// ------------------------------------------------------------------

function partiallyApply(argument, receiver, methodKey, context) {
  return function(...args) {
    return receiver[methodKey].apply(context, [argument].concat(args));
  }
}

var Stack = {
  proto: {
    type: 'Stack',

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

var stack = Stack.create();

console.log(stack.type);   // [Function]
console.log(stack.type()); // TypeError
