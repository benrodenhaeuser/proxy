function Stack() {
  var items = [];

  this.push = function(item) {
    items.push(item);
    return this;
  };

  this.pop = function() {
    return items.pop;
  }

  this.print = function() {
    console.log(items);
  }
}

var stack1 = new Stack();
var stack2 = new Stack();

stack1.push('a').push('b');
stack2.push(1).push(2);

stack1.print(); // ['a', 'b']
stack2.print(); // [1, 2]

console.log(Object.getOwnPropertyNames(stack1));
// ['push', 'pop', 'print']

// PROBLEM: every object implements the stack api itself,
// rather than relying on a prototype to implement it.

// This seems hard to avoid using a pure constructor approach.
