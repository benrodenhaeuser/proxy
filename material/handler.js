// alternative handler using isInherited:
// but our current solution seems ok

handler: function(data) {
  let isInherited = function(key, obj) {
    return (key in obj && !obj.hasOwnProperty(key));
  }

  return {
    get: (instance, key, proxy) => {
      let proto = Object.getPrototypeOf(instance);

      if (isInherited(key, instance)) {
        return function(...args) {
          return proto[key].apply(proxy, args.concat([data]));
        }
      } else {
        return Reflect.get(instance, key);
      }
    }
  };
},
