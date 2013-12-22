var Context = (function () {
    function Context() {
    }
    Context.extend = //For plain JS version
    //Returns a constructor function to instantiate a new context.
    //In the future it may also inherit some utility methods that are common to all contexts.
    //
    //It will check whether the passed callback function has a bindRoles() method, and if so,
    //any constructor arguments will be passed to bindRoles(). If the passed callback does not
    //have a bindRoles() method, then the roles should be bound at the top of the callback function.
    //
    //bindRoles() is useful for the case where you want to be able to re-bind the roles on an existing
    //context object.
    //
    function (callback) {
        return function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            //We always pass the parameters to the passed function (callback) because
            //we can't check whether or not a bindRoles() method exists until after we've
            //instantiated the context object.
            //The ContextConstructor function is needed so that we can pass constructor arguments dynamically
            //(see http://stackoverflow.com/a/13931627/560114)
            var ContextConstructor = function () {
                return callback.apply(this, args);
            };
            ContextConstructor.prototype = callback.prototype;

            var context = new ContextConstructor();
            context.constructor = callback;

            if (context.bindRoles)
                context.bindRoles.apply(context, arguments);
            return context;
        };
    };
    return Context;
})();
exports.Context = Context;

