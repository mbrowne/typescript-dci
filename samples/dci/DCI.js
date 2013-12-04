var Context = (function () {
    function Context() {
    }
    Context.extend = //for plain JS version
    function (callback) {
        //return type isn't really void; void is used because otherwise TS gives this error when running `new MyContext(...`:
        //"Call signatures used in a 'new' expression must have a 'void' return type."
        return function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var context = new callback();
            if (!context.bindRoles)
                throw new Error('bindRoles() method not found');

            context.bindRoles.apply(callback, arguments);
            return context;
        };
    };
    return Context;
})();
exports.Context = Context;

