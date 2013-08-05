define(["require", "exports"], function(require, exports) {
    (function (a) {
        (function (weekend) {
            weekend[weekend["Friday"] = 0] = "Friday";
            weekend[weekend["Saturday"] = 1] = "Saturday";
            weekend[weekend["Sunday"] = 2] = "Sunday";
        })(a.weekend || (a.weekend = {}));
        var weekend = a.weekend;
    })(exports.a || (exports.a = {}));
    var a = exports.a;

    (function (c) {
        var b = a.weekend;
        c.bVal = b.Sunday;
    })(exports.c || (exports.c = {}));
    var c = exports.c;
});

////[internalAliasEnumInsideLocalModuleWithoutExport.d.ts]
export declare module a {
    enum weekend {
        Friday,
        Saturday,
        Sunday,
    }
}
export declare module c {
    var bVal: a.weekend;
}
