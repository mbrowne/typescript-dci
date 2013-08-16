function func1() {
    for (var i = 0; ;) {
        var x = 0;
    }
    var k = 0;
}

function func2() {
    for (var i = 0; ;) {
        break;
    }
    var k = 0;
}

function func3() {
    for (var j = 0; ;) {
        return;
        var k = 0;
    }
    var j = 0;
}

function func4() {
    for (var j = 0; j < 5; ++j) {
        ;
    }
    var j = 0;
}

function func5() {
    for (var j = 0; j < 5; ++j) {
        return null;
    }
    var j = 0;
}

function func6() {
    for (var i in this) {
        continue;
    }
    var j = 0;
}

function func7() {
    for (var i in this) {
        ;
    }
    var j = 0;
}

function func8() {
    for (var i = 0; ;) {
        continue;
        var afterBreak = 0;
    }
    var unreach = 0;
}
