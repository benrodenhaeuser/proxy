// data binding: if the view changes, the model changes
// and if the model changes, the view changes
// -- that's at least very similar to the idea of live collections

// this is how we could have "live collections" without proxies:

var a = {
  get elems() {
    return document.querySelector('p');
  },
};

console.log(a.elems);

var pElem = document.createElement('p');
document.body.appendChild(pElem);

console.log(a.elems);

// this has to be done on a case by case basis, however (right?)

// what is a live collection anyway? it's a collection using a predefined criterion that dynamically adjusts its elements according to whether they satisfy the criterion.

// ... kind of?
