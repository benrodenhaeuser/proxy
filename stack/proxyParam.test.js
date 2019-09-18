const Stack = require('./proxyParam');

test('allows to push and pop', () => {
  const stack = Stack();
  stack.push('a').push('b').push('c');
  let item = stack.pop();
  expect(item).toBe('c');
  item = stack.pop();
  expect(item).toBe('b');
  item = stack.pop();
  expect(item).toBe('a');
});

test('instance has no own properties', () => {
  const stack = Stack();
  const ownProps = Object.getOwnPropertyNames(stack);
  expect(ownProps).toEqual([]);
});

test('prototype has own properties push and pop', () => {
  const proto = Stack.prototype;
  const ownProps = Object.getOwnPropertyNames(proto);
  expect(ownProps).toContain('push');
  expect(ownProps).toContain('pop');
});

test('push returns the receiver', () => {
  const stack = Stack();
  const receiver = stack.push(1);
  expect(receiver).toBe(stack);
});

test('creates instances with uniform prototype', () => {
  const stack1 = Stack();
  const stack2 = Stack();
  const proto1 = Object.getPrototypeOf(stack1);
  const proto2 = Object.getPrototypeOf(stack2);
  expect(proto1).toBe(Stack.prototype);
  expect(proto2).toBe(Stack.prototype);
});

test('allows to add methods to instances that use private data', () => {
  const stack = Stack();
  stack.push2 = (item, _) => {
    _.items.push(item);
  };
  stack.push2(1);
  let item = stack.pop();
  expect(item).toBe(1);
})

test('allows to add methods to prototype that use private data', () => {
  Stack.prototype.push3 = (item, _) => {
    _.items.push(item);
  };
  const stack = Stack();
  stack.push(3);
  let item = stack.pop();
  expect(item).toBe(3);
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

test('allows to circumvent access restrictions (in a sense)', () => {
  // ... this is unlikely to happen by accident!

  const stack = Object.create(Stack.prototype);
  const _ = { items: [] };
  stack.push('a', _);
  stack.push('b', _);
  expect(_.items).toEqual(['a', 'b']);
});
