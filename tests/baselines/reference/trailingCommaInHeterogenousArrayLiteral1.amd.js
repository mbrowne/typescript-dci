var arrTest = (function () {
    function arrTest() {
    }
    arrTest.prototype.test = function (arg1) {
    };
    arrTest.prototype.callTest = function () {
        // these two should give the same error
        this.test([1, 2, "hi", 5]);
        this.test([1, 2, "hi", 5]);
    };
    return arrTest;
})();
