function func1() {
    while (true) {
        //break;
    }
    var unreach = 0;
}

function func2() {
    while (true) {
        while (true) {
            if (false) {
                break;
            }
        }
        var x = 0;
    }
}

function func3() {
    while (true) {
        return null;
    }
    var x = 0;
}

function func4() {
    while (true) {
        continue;
        var afterBreak = 0;
    }

    var unreach = 0;
}

function func5() {
    while (true) {
        break;
        var afterBreak = 0;
    }
    var unreach = 0;
}

function func6() {
    while (true) {
        while (true) {
            if (true) {
                continue;
            }
        }
        var afterBreak = 0;
    }
    var unreach = 0;
}
