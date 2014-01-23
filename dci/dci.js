var isNodeJs = (typeof window == 'undefined' && typeof global != 'undefined');
var globalNamespace = isNodeJs ? global : window;

if (!isNodeJs) {
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function () {
            }, fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
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
function getRoleMember(context, player, roleName, memberName) {
    var roleMethod = context['__$' + roleName][memberName];
    if (roleMethod) {
        //bind the role player as `this` on the specified role method
        return roleMethod.bind(player);
    } else {
        if (!player[memberName]) {
            throw new Error('Method or property "' + memberName + '" not found on role "' + roleName + '" nor on its current role player.');
        }
        return player[memberName];
    }
}
exports.getRoleMember = getRoleMember;

//This function is for handling calls beginning with `this`; it calls a method on the current role player,
//which could be either a role method or a method on the data object.
//
// TODO test data object methods that aren't overridden by the role
//
function callMethodOnSelf(context, player, roleName, methodName, args) {
    if (player != context[roleName]) {
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

    var roleMethod = context['__$' + roleName][methodName];

    if (typeof roleMethod == 'function') {
        return (args ? roleMethod.apply(player, args) : roleMethod.call(player));
    } else {
        if (!player[methodName]) {
            var msg = 'Method "' + methodName + '" not found';
            if (player['constructor'].name)
                msg += ' on object of type "' + player['constructor'].name + '" nor on any of the roles it is currently playing.';
            throw new Error(msg);
        }
        return player[methodName].apply(player, args);
    }
}
exports.callMethodOnSelf = callMethodOnSelf;

