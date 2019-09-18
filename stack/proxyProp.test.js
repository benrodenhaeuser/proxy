const Stack = require('./proxyProp');

test('allows to push and pop', () => {
  const stack = Stack();
  stack.push('a');
  stack.push('b');
  stack.push('c');
  let item = stack.pop();
  expect(item).toBe('c');
  item = stack.pop();
  expect(item).toBe('b');
  item = stack.pop();
  expect(item).toBe('a');
});

test('instance has own property "_"', () => {
  const stack = Stack();
  const ownProps = Object.getOwnPropertyNames(stack);
  expect(ownProps).toContain('_');
});

test('prototype has own properties "push" and "pop"', () => {
  const proto = Stack.prototype;
  const ownProps = Object.getOwnPropertyNames(proto);
  expect(ownProps).toContain('push');
  expect(ownProps).toContain('pop');
});

test('"push" returns the receiver', () => {
  const stack = Stack();
  const receiver = stack.push(1);
  expect(receiver).toBe(stack);
});

test('instances have same prototype', () => {
  const stack1 = Stack();
  const stack2 = Stack();
  const proto1 = Object.getPrototypeOf(stack1);
  const proto2 = Object.getPrototypeOf(stack2);
  expect(proto1).toBe(Stack.prototype);
  expect(proto2).toBe(Stack.prototype);
});

test('allows to add methods to instance that use private data', () => {
  const stack = Stack();
  stack.push2 = function(item) {
    this._.items.push(item);
    return this.proxy;
  };
  stack.push2(1);
  let item = stack.pop();
  expect(item).toBe(1);
});

test('allows to add methods to proto that use private data', () => {
  Stack.prototype.push3 = function(item) {
    this._.items.push(item);
  };
  const stack = Stack();
  stack.push(3);
  let item = stack.pop();
  expect(item).toBe(3);
});

test('allows to add methods to proto that use private data (another)', () => {
  Stack.prototype.retrieve = function() {
    return this._.items;
  }

  const stack = Stack();
  const items = stack.push(1).push(2).retrieve();
  expect(items).toEqual([1, 2]);
});

test('allows to maintain separate stacks with separate data', () => {
  const stack1 = Stack();
  const stack2 = Stack();
  stack1.push('a').push('b');
  stack2.push(1).push(2);
  let item1 = stack1.pop();
  let item2 = stack2.pop();
  expect(item1).toBe('b');
  expect(item2).toBe(2);
});

test('allows to circumvent access restrictions', () => {
  // ,,, this is unlikely to happen by accident!

  const stack = Object.create(Stack.prototype);
  stack._ = { items: [] };
  stack.push('a');
  stack.push('b');
  expect(stack._.items).toEqual(['a', 'b']);
});

test('getting private data throws an exception', () => {
  const stack = Stack();
  expect(() => {
    stack._;
  }).toThrow();
});

test('setting private data throws an exception', () => {
  const stack = Stack();
  expect(() => {
    stack._ = {};
  }).toThrow();
});
