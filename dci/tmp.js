var handler = {
	get: function(target, propName) {
		return 47;
	}
};

//This works in Firefox
var p = new Proxy({}, handler); 
p.foo; //outputs 47

//This doesn't.
//Will it work in V8 / node.js when Proxy support is added?
Object.prototype = new Proxy({}, handler); 
Object.prototype.foo;