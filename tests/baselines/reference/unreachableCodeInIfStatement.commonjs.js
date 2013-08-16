function func1() {
    if (true) {
        var x;
    } else {
        var y = 1;
        var j = 0;
    }
}

function func2() {
    if (false) {
        var x;
    } else {
        var y = 1;
        var j = 0;
    }
}

function func3(x) {
    if (x === 5) {
        var x1;
        return;
    } else {
        var y = 1;
        var j = 0;
        return;
    }
    var j = 0;
}

function func4(x) {
    if (x === 5) {
        var x1;
    } else {
        var y = 1;
        var j = 0;
        return;
    }
    var j = 0;
}

function func5(x) {
    if (x === 5) {
        var x1;
        return;
    } else {
        var y = 1;
        var j = 0;
    }
    var j = 0;
}
