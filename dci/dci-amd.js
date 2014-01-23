define(["require", "exports"], function(require, exports) {
    var isNodeJs = (typeof window == 'undefined' && typeof global != 'undefined');
    var globalNamespace = isNodeJs ? global : window;

    //TODO Support DestinationAccount['de' + 'posit'](amount)
    //
    //DestinationAccount['de' + 'posit'](amount) could be rewritten to:
    //__context.__$DestinationAccount['de' + 'posit'].call(__context.DestinationAccount, amount)
    //
    //would be better to give a nice error message if role method not found:
    //DCI.getRoleMethod(__context, 'DestinationAccount', 'de' + 'posit').call(__context.DestinationAccount, amount)
    function getRoleMethod(context, roleName, methodName) {
        var roleMethod = context['__$' + roleName][methodName];
        if (!roleMethod) {
            throw new Error('Method "' + methodName + '" not found on role "' + roleName + '"');
        }
        return roleMethod;
    }
    exports.getRoleMethod = getRoleMethod;

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
});
