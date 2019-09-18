let array = [];
let observedArray = new Proxy(array, {
    set(target, propertyKey, value, receiver) {
        console.log(propertyKey+'='+value); // we are observing it!
        Reflect.set((target, propertyKey, value, receiver);
} });
observedArray.push('a');
