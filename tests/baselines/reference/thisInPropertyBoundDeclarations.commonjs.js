var Bug = (function () {
    function Bug() {
    }
    Bug.prototype.foo = function (name) {
        this.name = name;
    };
    Bug.func = [
        function (that, name) {
            that.foo(name);
        }
    ];
    return Bug;
})();

// Valid use of this in a property bound decl
var A = (function () {
    function A() {
        this.prop1 = function () {
            this;
        };
        this.prop2 = function () {
            var _this = this;
            function inner() {
                this;
            }
            (function () {
                return _this;
            });
        };
        this.prop3 = function () {
            function inner() {
                this;
            }
        };
        this.prop4 = {
            a: function () {
                return this;
            }
        };
        this.prop5 = function () {
            return {
                a: function () {
                    return this;
                }
            };
        };
    }
    return A;
})();

var B = (function () {
    function B() {
        var _this = this;
        this.prop1 = this;
        this.prop2 = function () {
            return _this;
        };
        this.prop3 = function () {
            return function () {
                return function () {
                    return function () {
                        return _this;
                    };
                };
            };
        };
        this.prop4 = '  ' + function () {
        } + ' ' + function () {
            return function () {
                return function () {
                    return _this;
                };
            };
        };
        this.prop5 = {
            a: function () {
                return _this;
            }
        };
        this.prop6 = function () {
            return {
                a: function () {
                    return _this;
                }
            };
        };
    }
    return B;
})();
