/*
function A() {}
(<Test> A).something = 123;

export var Context = {
extend: function(callback): any {
return function(...args : any[]) {
var context = new callback();
if (!context.bindRoles) throw new Error('bindRoles() method not found');

context.bindRoles.apply(callback, arguments);
return context;
}
}
};
*/
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
            if (!context.bindRoles)
                throw new Error('bindRoles() method not found');

            context.bindRoles.apply(callback, arguments);
            return context;
        };
    };
    return Context;
})();
exports.Context = Context;

