var C1 = (function () {
    function C1() {
        return;
        var unreachable = 1;
    }
    return C1;
})();

var C2 = (function () {
    function C2() {
        var unreachable = 0;
        if (true) {
        } else {
            unreachable++;
        }
    }
    return C2;
})();

var C3 = (function () {
    function C3() {
        for (var i = 0; ;) {
        }
        var unreachable = 1;
    }
    return C3;
})();

var C4 = (function () {
    function C4() {
        var neverEndLoop = 0;
        while (true) {
        }
        neverEndLoop++;
    }
    return C4;
})();

var C5 = (function () {
    function C5() {
        try  {
            return;
        } catch (error) {
            throw "some error";
        } finally {
        }
        var unreachableCode = 1;
    }
    return C5;
})();

var C6 = (function () {
    function C6() {
        try  {
        } catch (error) {
        } finally {
            return 0;
        }
        var unreachableCode = 1;
    }
    return C6;
})();

var C7 = (function () {
    function C7() {
        try  {
        } catch (error) {
            throw "Error";
        } finally {
        }
        var reachableCode = "hi";
    }
    return C7;
})();
