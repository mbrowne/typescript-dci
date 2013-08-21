var C1 = (function () {
    function C1() {
    }
    C1.prototype.func1 = function () {
        return;
        var unreachable;
    };

    C1.prototype.func2 = function () {
        if (true) {
        } else {
            var unreachable;
        }
    };

    C1.prototype.func3 = function () {
        if (false) {
            var unreachable;
        } else {
        }
    };

    C1.prototype.func4 = function () {
        for (var i = 0; ;) {
        }
        var unreachable;
    };

    C1.prototype.func5 = function () {
        while (true) {
        }
        var unreachable;
    };

    C1.prototype.func6 = function () {
        try  {
            return;
        } catch (err) {
        } finally {
        }
        var reachable = 1;
    };

    C1.prototype.func7 = function () {
        try  {
            return;
        } catch (err) {
            throw "some error";
        } finally {
        }
        var unreachable = 1;
    };

    C1.prototype.func8 = function () {
        try  {
        } catch (err) {
        } finally {
            return;
        }
        var unreachable = 1;
    };

    C1.prototype.func9 = function () {
        while (true) {
            while (true) {
            }
            var unreachable = 1;
        }
    };

    C1.prototype.func10 = function () {
        while (true) {
            while (true) {
            }
        }
        var unreachable = 1;
    };

    C1.prototype.func11 = function (arg) {
        while (true) {
            while (true) {
                if (true) {
                    break;
                }
            }
            var reachable = 1;
        }
        arg++;
    };

    C1.prototype.func12 = function (arg) {
        outter:
        while (true) {
            inner:
            while (true) {
                if (true) {
                    break outter;
                }
            }
            if (arg === 1) {
            }
        }
    };
    return C1;
})();

// to make sure that we push/pop correct ControlFlowBlock
var reachable = 1;
