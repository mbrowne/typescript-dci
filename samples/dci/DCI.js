var Context = (function () {
    function Context() {
    }
    Context.extend = //for plain JS version
    function (callback) {
        return function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var context = new callback();
            context.bindRoles.apply(callback, arguments);
            return context;
        };
    };
    return Context;
})();
exports.Context = Context;

