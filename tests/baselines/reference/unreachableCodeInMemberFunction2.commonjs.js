var C = (function () {
    function C() {
    }
    Object.defineProperty(C.prototype, "Prop", {
        get: function () {
            return this.prop;
            this.prop + "hello World";
        },
        set: function (str) {
            throw "error";
            this.prop + "hello World";
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(C.prototype, "Prop1", {
        get: function () {
            if (true) {
            } else {
                this.prop + this.prop1;
            }
            return this.prop1;
        },
        set: function (i) {
            if (false) {
                i++;
            } else {
            }
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(C.prototype, "Prop11", {
        get: function () {
            while (true) {
            }
            return this.prop1;
        },
        set: function (num) {
            for (var i = 0; ;) {
            }
            num++;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(C.prototype, "Prop12", {
        get: function () {
            for (var i; ;) {
            }
            return this.prop1;
        },
        set: function (num) {
            while (false) {
                throw "Error that is not reached";
            }
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(C.prototype, "Prop13", {
        get: function () {
            for (var i in this) {
            }
            return this.prop1;
        },
        set: function (num) {
            while (true) {
                while (true) {
                    continue;
                }
                var unreachableCode = 1;
            }
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(C.prototype, "Prop14", {
        get: function () {
            while (true) {
                while (true) {
                    if (false) {
                        break;
                    }
                }
                var unreachableCode = 1;
            }
            return this.prop1;
        },
        set: function (num) {
            try  {
                throw "error1";
            } catch (err) {
                throw "error2";
            } finally {
            }
            var unreachable = num + 1;
        },
        enumerable: true,
        configurable: true
    });

    return C;
})();
