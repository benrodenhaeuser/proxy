```javascript
var Stack = {
  push: function(data, value) {
    data.push(value);
    return this;
  },

  pop: function(data) {
    return data.pop();
  },

  print: function(data) {
    data.forEach(function(value) {
      console.log(value);
    });
  },

  init: function() {
    var data  = [];
    var proto = Object.getPrototypeOf(this);

    Object.keys(proto).forEach(function(key) {
      if (key !== 'init' && typeof proto[key] === 'function') {
        this[key] = function(...args) {
          return proto[key].apply(this, [data].concat(args));
        }
      }
    }.bind(this));

    return this;
  },
};
```

Victor's solution: a "database" hidden in the closure

```javascript
var Stack = (function() {
  var database = {};  

  var nextId = (function() {
    var id = 0;
    return function() { return id++; };
  })();

  return {
    push: function(value) {
      var data = database[this.id];
      data.push(value);
      return this;
    },

    pop: function() {
      var data = database[this.id];
      return data.pop();
    },

    print: function() {
      var data = database[this.id];
      data.forEach(function(value) {
        console.log(value);
      });
    },

    init: function() {
      this.id = nextId();
      database[this.id] = [];
      return this;
    },
  };
})();
```

Is there a third solution?

Non-Solutions
Trade-Off
