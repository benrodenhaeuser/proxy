class Stack
  def initialize()
    @data = []
  end

  def push(value)
    @data << value
  end

  def pop
    @data.pop
  end

  def print
    puts stack.to_s
  end
end

stack = Stack.new
stack.push('a')

# reopen the Stack class and extend its interface:

class Stack
  def size
    @data.size
  end
end

puts stack.size # 1

# alternatively, define size method directly on instance:

def stack.size2
  @data.size
end

puts stack.size2 #  1
