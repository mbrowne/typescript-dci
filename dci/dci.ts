//DCI

/*

SourceAccount {
	foo() {
		this['bar']();
	}
	bar() {}
}

var handler = {
	get: function(target, propName) {
		//TEMP
		return 'test';
	
		//This is all ONLY to check for the case where this['someMethod'] is called
		//from within a role method.
		//Role method calls that begin with the role name, e.g. DestinationAccount['deposit'](),
		//are taken care of at compile time.

		//the function that attempted to access a property on this object
		var caller = arguments.callee.caller;
	
		//if caller is a role method, then we want to check if propName is also a role method
		if (caller.__isRoleMethod) {
			var potentialRoleMethodName = propName;
			var context = caller.__context,
				roleName = caller.__roleName,
				rolePlayer = target;
		
			var role = context['__$' + roleName];
			if (role[potentialRoleMethodName]) {
				//bind() wraps the function with an outer function which ensures
				//that the `this` keyword works within the called role method
				return role[potentialRoleMethodName].bind(rolePlayer);
			}
		}
	}
};

Object.prototype = new Proxy({}, handler); 
Object.prototype.foo;

//var o = {};
//o.foo;

*/


declare var global: Object;

var isNodeJs = (typeof window == 'undefined' && typeof global != 'undefined');
var globalNamespace = isNodeJs ? global: window;

//Ensure that Function.prototype.bind() is available (used by getRoleMember() function below)
if (!isNodeJs) {
	//shim for Function.prototype.bind() for older browsers
	if (!Function.prototype.bind) {
	  Function.prototype.bind = function (oThis) {
		if (typeof this !== "function") {
		  // closest thing possible to the ECMAScript 5 internal IsCallable function
		  throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}

		var aArgs = Array.prototype.slice.call(arguments, 1), 
			fToBind = this, 
			fNOP = function () {},
			fBound = function () {
			  return fToBind.apply(this instanceof fNOP && oThis
									 ? this
									 : oThis,
								   aArgs.concat(Array.prototype.slice.call(arguments)));
			};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	  };
	}
}

//TODO Support DestinationAccount['de' + 'posit'](amount)
//
//DestinationAccount['de' + 'posit'](amount) could be rewritten to:
//__context.__$DestinationAccount['de' + 'posit'].call(__context.DestinationAccount, amount)
//
//would be better to give a nice error message if role method not found:
//DCI.getRoleMember(__context, __context.DestinationAccount, 'DestinationAccount', 'de' + 'posit').call(__context.DestinationAccount, amount)

//Gets a member on a role player - can be either a role method or a method or property of the role player object
export function getRoleMember(context: Object, player: Object, roleName: string, memberName: string) {
	if (player != context[roleName]) {
		//If we're here, it's because the programmer used `this` inside a closure inside a role method.
		//So either `this` refers to some other object besides the current role, or the programmer used `this`
		//inside a closure when they should have used `self`.
		//
		//In other words this code would also be reached if `this` is equal to `undefined`, `global`, or `window`.)
		//...for example, if the SourceAccount.transferOut() method in the Transfer Money example contained the following code:
		//	[1,2,3].forEach(function() {
		//		this.withdraw();  //`this` is actually equal to `window` or `global` here! (or `undefined` in strict mode)
		//	});
		//
		//Because we need to account for the first case (`this` refers to some other object besides the current role),
		//which is perfectly valid, we simply return the property on `this` just as would happen normally in Javascript.
		return player[memberName];
	}

    var roleMethod = context['__$' + roleName][memberName];
    if (roleMethod) {
		//bind the role player as `this` on the specified role method
		return roleMethod.bind(player);    
    }
    else {
	    //check for property on role player
    	if (!(memberName in player)) {
    		throw new Error('Method or property "' + memberName + '" not found on role "' + roleName + '" nor on its current role player.');
    	}
    	return player[memberName];
    }
}

//This function is for handling calls beginning with `this`; it calls a method on the current role player,
//which could be either a role method or a method on the data object.
//
// TODO test data object methods that aren't overridden by the role
//
export function callMethodOnSelf(context: Object, player: Object, roleName: string, methodName: string, args: Array): any {
	//if `this` is not equal to the current role player
	if (player != context[roleName]) {
    	//If we're here, then it's a data object method, not a role method
    	//(Either that or the programmer used `this` inside a closure when they should have used `self`.
    	//In other words this code would also be reached if `this` is equal to `undefined`, `global`, or `window`.)
		if (!player[methodName]) {
			var msg = 'Method "' + methodName + '" not found';
			if (player['constructor'].name) {
				msg += ' on object of type "' + player['constructor'].name + '".';
			}
			throw new Error(msg);
		}
		return player[methodName].apply(player, args);
    	
    	//Old version: commenting since it's inconsistent...this makes `this.someRoleMethod()` work
    	//even inside a closure like [1,2,3].forEach(...),
    	//but using `this` in other ways, like `this` as an argument, would not necessarily work.
    	//Better to just use `self`.
    	/*
		
		//support functions within role methods for which `this` is unbound - but make sure we
		//don't wrongly assume `this` refers to the current role 
		if (player != undefined && player != globalNamespace) {
			//not a role method; call normally
			if (!player[methodName]) {
				var msg = 'Method "' + methodName + '" not found';
				if (player['constructor'].name) {
					msg += ' on object of type "' + player['constructor'].name + '".';
				}
				throw new Error(msg);
			}
			return player[methodName].apply(player, args);
		}
		//if we're here, then `this` probably *should* refer to the current role and the only
		//reason it's undefined is most likely a nested function
		//(e.g. a callback function passed to forEach() to loop over an array)
		else {
			player = context[roleName];
		}
		*/
	}

	var roleMethod = context['__$'+roleName][methodName];
	//if the method exists on the role, we always call it (role methods override data object methods)
	if (typeof roleMethod == 'function') {
		return (args ? roleMethod.apply(player, args): roleMethod.call(player));
	}
	//otherwise, call the data object method
	//(if the method is not found on the data object, this will throw Javascript's usual
	//'[function name] is not defined' error)
	else {
		if (!player[methodName]) {
			var msg = 'Method "' + methodName + '" not found';
			if (player['constructor'].name)
				msg += ' on object of type "' + player['constructor'].name + '" nor on any of the roles it is currently playing.';
			throw new Error(msg);
		}
		return player[methodName].apply(player, args);
	}
}