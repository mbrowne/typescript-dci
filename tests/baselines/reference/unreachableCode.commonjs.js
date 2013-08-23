function func1() {
    return null;
    var x = 5;
    var y = 6;
}

function func3() {
    throw "an error may be?";
    var x = 0;
}

function func4() {
    var x = 4;
    return;
    ++x;
    x = x - 1;
}

function func5() {
    var x = 4;
    return;
    ;
}

function func6() {
    var x = function (a) {
        return;
        a = 0;
    };
    var x1 = {
        subFunc: function (a) {
            return;
            var x = 0;
        }
    };
}

function func7(x) {
    with (x) {
        return;
        var a = 0;
    }
    return function (a) {
        return;
        a = 0;
    };
}

function func8(funC) {
}
func8(function (a) {
    return null;
    a = 0;
});

func8(function (a) {
    return;
});

function fun9() {
    var x = function (a) {
        return;
        var hi = "hello";
    };
}

var object = {
    get propertyX() {
        return null;
        var x = 0;
    },
    set propertyX(newV) {
        throw "error";
        var x = 0;
    }
};

function func10() {
    O:
    while (true) {
        I:
        while (true) {
            if (true) {
                break;
            }
        }
        var x = 1;
    }
}

function func11() {
    O:
    while (true) {
        I:
        while (true) {
            if (false) {
                break;
            }
        }
        var x = 1;
    }
}
